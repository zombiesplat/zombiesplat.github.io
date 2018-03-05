---
layout: post
title: Mutex - Use It To Prevent Double-Click Submit
date: 2018-03-05 10:00:00 -0700
tags: [technical]
current: post
cover:  assets/images/mutex.png
navigation: True
class: post-template
subclass: 'post tag-technical'
---

The more I am around other programmers the more I realize some of the things I've used to solve problems are not widely
known about. So, if you've ever had to write javascript to disable a button so that it doesn't submit twice, read on.

### Stop the double-click submit

So lets get some keywords in this article and also give you a hint about what this article is also talking about. You
could call Mutex mutual exclusion, flock, thread locking, process locking, semaphore, or that thing you do when you
don't want to process a piece of code more than once at a time. If you're like me the first question after discovering
this topic would be, why is there so many words for the same thing? That may very well be due to the different ways to
implement these solutions.

The heart of the problem is to acquire a permission to execute a block of code. If you've ever scheduled a cron job to
run every hour and perhaps a table became locked, or a million records cause the process to no longer take less than an
hour and suddenly that process begins to overlap and run twice. Now you have two or more invoices on an account and
confused or angry customers. Any admin who's seen this problem knows all you have to do is check for a PID file and
check to see if the process id is running and if everything is not there, then create it and start running the code.
This procedure runs great and is actually very achievable from a PHP web application using PHP's own function `flock()`
flock() has a few limitations that will become more apparent very soon, or if you're already thinking ahead then read
ahead without fear. The biggest limitation here is that if you have the most common issue of a web programmer which is
the double-click from a web form. The reason this is an issue is because flock does not guarantee a lock can be obtained
even on the same system because of how some operating systems can only lock `per process thread`. Which as you know, any
web server must have multiple processes running to be effective in the real world. Time to play the game of problem ->
solution. 

PHP offers the ability to talk across threads, called semaphore. I won't dive in to this at all really because you're
smart, and understand that any web app these days needs to run across multiple servers. You might think you already have
a database set up and I could just write a random number to some table with a compound primary index, then before I
start my block of sensitive code, I attempt to write to that table and if I get an error because it already exists then
kill the thread. This works, I know it because I ran across this solution several years ago. There are two major flaws
however, it doesn't clean up after itself and it's a database call which can sometimes get expensive with time.

Let's use memcache or redis or any other key value caching service!

### Redis to the rescue

Yes, Redis is my example here, use ElastiCache if you want, but here's the main thing you're looking for. Speed, and
expiration of keys. Set your key expiration to be the maximum amount of time you expect a multi submit could happen.
That could be 5 or 10 minutes if your application suffers from web servers who will drop connections and the client
takes 5 minutes before deciding to hit refresh on the page. If you're doing things right, your code will have a way of
knowing if a transaction has been processed before you begin processing it, such as a status column of some kind.

As a recap, the work flow is this

```
if(getMutexLock(unique_key, 500ms)) {
    // Make soup
    releaseLock(unique_key);
} else {
    // No soup for you
}
```

However here's what ends up happening, let's just say you are submitting a regular &lt;form&gt; post and you haven't
put javascript on it to help prevent a double click submit. That means that the second submit is the one that the user
will see the response of. `No soup for you`. Well that's not good, because the soup was made but we told the user that
it wasn't. In this case, the get lock function should wait until the lock frees up and then pass back the results of the
original lock. This way any subsequent call will get the same results for a short period of time, or rather, we cache
the results.

I don't want to reinvent the wheel and the motto of any good programmer should be DRY, so let's use the ninja-mutex 
package from [github](https://github.com/arvenil/ninja-mutex). In the implementation of acquireLock you can pass in a
timeout parameter, where `null` means wait forever for the lock, `0` means try once, and `>0` means keep trying every
`$timeout` milliseconds to acquire a new lock before giving up. For our code we will use the `null` parameter to block
all threads until the first one is done.

```php
<?php
require 'vendor/autoload.php';

use NinjaMutex\Lock\MemcacheLock;
use NinjaMutex\MutexFabric;

$memcache = new Memcache();
$memcache->connect('127.0.0.1', 11211); //ideally not localhost but easy for example
$lock = new MemcacheLock($memcache);
$results = null;
$mutexFabric = new MutexFabric('memcache', $lock);
if ($mutexFabric->get('make-soup')->acquireLock(null)) {
    $results = $memcache->get('make-soup-results');
    if (empty($results)) {
        $results = 'Broccoli and Cheese';
        $memcache->add('make-soup-results', $results, false, $reasonable_amount_of_time);
    }

    // and release lock after you finish
    $mutexFabric->get('make-soup')->releaseLock();
}
if (empty($results)) {
    // something went really wrong
} else {
    echo "I made $results soup";
}
```

So there you have it. And if you're using jQuery, use something like the `$.one()` or just GTS because there are lots of
examples for that. Your first line of defense is the browser, but don't count on your users to always use your site the
way you want them to and protect your most crucial components with mutex locks.