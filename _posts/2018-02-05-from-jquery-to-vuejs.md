---
layout: post
title: From jQuery to VueJS
date: 2018-02-05 10:00:00 -0700
tags: [technical]
current: post
cover:  assets/images/advanced.jpg
navigation: True
class: post-template
subclass: 'post tag-technical'
---

As I was first making the transition from jQuery to VueJS I was having a hard time grappling with how to migrate the
jQuery dependent code I had already developed in to the new Laravel and Vue framework. My problem is probably one that
you have run in to several times, the single or none check box. If you're not familiar, this is where you present the
user with a list of options and only want them to select one of those options. From a programming perspective the
easiest solution would be a select box.


~~~html
<select name="select_one">
  <option value="">None</option>
  <option value="option-1">Option 1</option>
  <option value="option-2">Option 2</option>
  ...
</select>
~~~


A select box makes perfect sense when dealing with a list of options that has a lot of options. However, in my case the
UX desired to have 2 or 3 options and it was determined that seeing all the options was preferred. At this point,
it might make sense to have radio inputs with "None" as an option.


~~~html
<ul>
  <li><label><input type="radio" name="select_one" value=""> None</label></li>
  <li><label><input type="radio" name="select_one" value="option-1"> Option 1</label></li>
  <li><label><input type="radio" name="select_one" value="option-2"> Option 2</label></li>
  ...
</ul>
~~~


In spite of the obvious advantage for making the programmer's life easier, this solution still offers too much to the
user and a checkbox option is wanted. Therefor a javascript solution is required and jQuery makes this easy.

~~~html
<ul>
  <li><label><input type="checkbox" name="select_one" value="option-1"> Option 1</label></li>
  <li><label><input type="checkbox" name="select_one" value="option-2"> Option 2</label></li>
  ...
</ul>
~~~

~~~js
$('input[name=select_one]').on('change', function() {
    $('input[name=select_one]').not(this).prop('checked', false);  
});
~~~


This works great when your site is done entirely with jQuery because everything is DOM based meaning that whatever the
state of the elements you see on the screen is what gets submitted in a form post.

Now let's attack the same problem with Vue but let's assume that, like me at the time of trying to solve this problem,
you are new to Vue (or React or Angular).

My first thoughts were to keep the jQuery because it should still register the click events and update the Vue model
and the marriage between Vue and jQuery will be complete.

~~~html
<div id='app'>
<my-component inline-template>
  <div>
    <label>
        <input v-model="select_one" type="checkbox" name="select_one" value="option-1">
         Option 1
    </label>
    <label>
        <input v-model="select_one" type="checkbox" name="select_one" value="option-2" >
         Option 2
    </label>
    <label>
        <input v-model="select_one" type="checkbox" name="select_one" value="option-3">
         Option 3
    </label>
    <div>
    {{ select_one }}
    </div>
  </div>
</my-component>
</div>
~~~

~~~js
Vue.component('my-component', {
    data: function () {
        return {
            select_one: '',
        };
    },
    mounted: function() {
        $(function () {
            $('input[name=select_one]').on('change', function() {
            $('input[name=select_one]').not(this).prop('checked', false);
        });
      });
    },
});
var vm = new Vue({
  el: '#app'
});
~~~

This seems simple enough. the v-model uses the property of `select_one` which is defined as a string. It gets updated
when I click the checkbox and also the jQuery will uncheck the other boxes. And when I run it, select_one transmutates
from a string to a boolean because Vue considers a checkbox that isn't an array to be a simple boolean. Hmm okay,
programmer brain of mine says to use the tools at my disposal and morph the select_one to an array and on the PHP back
end, just know that it could only have one element and just pop it off the stack. DONE! right?

Well, to save you from reading all the code iterations of me chasing this rabbit down a hole, here's the short version.
I couldn't manipulate the DOM and then trigger those changes in order to update view. That is just fundamentally not how
Vue works. Vue needs to be who controls the DOM if you're dealing with inputs. So here's how to engineer this solution.

### Step 1: Come up with a cool name

Select One is descriptive, but not cool.  How about "The Highlander"

Perfect. If you're unaware of The Highlander's protagonist's goal, it is that there can be only one highlander.
Check it out when you have some time. [IMBD | The Highlander](http://www.imdb.com/title/tt0091203/)

![The Highlander](/assets/images/highlander.jpg)

### Step 2: Use v-model to update the DOM, not the other way around.

In this example problem we have an imaginary event registration and with your registration you can pick one of three
gifts or none at all.

~~~html
<div id='app'>
  <label>
    <input v-model="highlander_options.registration_options" type="checkbox" value="bobble_head" @change="highlander('registration_options', 'registration_gift', 'bobble_head')">
     Bobble Head
  </label>
  <label>
    <input v-model="highlander_options.registration_options" type="checkbox" value="baseball" @change="highlander('registration_options', 'registration_gift', 'baseball')">
     Autographed Baseball
  </label>
  <label>
    <input v-model="highlander_options.registration_options" type="checkbox" value="coffee_mug" @change="highlander('registration_options', 'registration_gift', 'coffee_mug')">
     Custom Coffee Mug
  </label>
  <div>
    {{ form.registration_options }}
  </div>
  <div>
    {{ highlander_groups }}
  </div>
</div>
~~~

~~~js
new Vue({
    el:'#app',
    data: function () {
        return {
            form : {
                registration_options: '',
            },
            highlander_options : {
                registration_options: [],
            },
            highlander_groups: {}
        };
    },
    methods: {
        highlander: function(form_input, highlander_input, value) {
            if (this.form[form_input] == value) {
                this.form[form_input] = '';
                this.highlander_options[form_input] = [];
            } else {
                this.form[form_input] = value;
                this.highlander_options[form_input] = [value];
            }
        }
    }
});
~~~

To understand what's going on here, let's understand the data elements. The form is the data that should be traveling to
the application, in this example only the registration_options property is being sent. The highlander_options element
will hold the array version of the form element, so it needs the same name. We need this replication because of how vue
wants to make a standard checkbox boolean and an array of options gives us the text we want. Plus it is a lot easier to
use v-model with checkboxes so that vue can update the DOM. The highlander_groups object holds the current value of the
highlander_input which will become more obvious why I do it this way in the next example.


Now, here's one more curve ball, let's say in our example that we want to allow for multiple highlander groups. The
event registration has options such as the gift, a golf tournament, a gala, and a donation. The gift has 3 options of
of which you could choose only one, and the donation level is also a one or none type. So let's refactor this a bit to
accomodate this requirement.

~~~html
<div id='app'>
  <label>
    <input v-model="form.registration_options" type="checkbox" value="bobble_head" @change="highlander('registration_options', 'registration_gift', 'bobble_head')">
     Bobble Head
  </label>
  <label>
    <input v-model="form.registration_options" type="checkbox" value="baseball" @change="highlander('registration_options', 'registration_gift', 'baseball')">
     Autographed Baseball
  </label>
  <label>
    <input v-model="form.registration_options" type="checkbox" value="coffee_mug" @change="highlander('registration_options', 'registration_gift', 'coffee_mug')">
     Custom Coffee Mug
  </label>
  <label>
    <input v-model="form.registration_options" type="checkbox" value="tournament">
     Golf Tournament
  </label>
  <label>
    <input v-model="form.registration_options" type="checkbox" value="gala">
     Gala
  </label>
  <label>
    <input v-model="form.registration_options" type="checkbox" value="donation_50" @change="highlander('registration_options', 'donation', 'donation_50')">
     Silver Donor $50
  </label>
  <label>
    <input v-model="form.registration_options" type="checkbox" value="donation_200" @change="highlander('registration_options', 'donation', 'donation_200')">
     Gold Donor $200
  </label>
  <label>
    <input v-model="form.registration_options" type="checkbox" value="donation_1000" @change="highlander('registration_options', 'donation', 'donation_1000')">
     Platinum Donor $1000
  </label>
  <div>
    \{\{ form.registration_options \}\}
  </div>
  <div>
    {{ highlander_groups }}
  </div>
</div>
~~~

~~~js
new Vue({
    el:'#app',
    data: function () {
        return {
            form : {
                registration_options: [],
            },
            highlander_options : {
                registration_options: [],
            },
            highlander_groups: {}
        };
    },
    methods: {
        highlander: function(form_input, highlander_input, value) {
            if (typeof this.form[form_input] === 'string') {
                if (this.form[form_input] == value) {
                    this.form[form_input] = '';
                    this.highlander_options[form_input] = [];
                } else {
                    this.form[form_input] = value;
                    this.highlander_options[form_input] = [value];
                }
            } else {
                let index = this.form[form_input].indexOf(this.highlander_groups[highlander_input]);
                if (index != -1) {
                    this.form[form_input].splice(index, 1)
                }
                this.highlander_groups[highlander_input] = null;
                if (this.form[form_input].indexOf(value) != -1) {
                    this.highlander_groups[highlander_input] = value;
                }
            }
        }
    }
});
~~~

Now we can see that the registration_options element is still an array of values and the few options that need to be
limited are appropriately limited to a single option per highlander group.


### Wrap Up

When learning Vue while coming from the jQuery world, just remember to let the data drive the display and your life will
be much easier.