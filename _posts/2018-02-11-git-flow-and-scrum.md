---
layout: post
title: Git-flow And Scrum
date: 2018-02-11 10:00:00 -0700
tags: [technical]
current: post
cover:  assets/images/git-rebasing-header.jpg
navigation: True
class: post-template
subclass: 'post tag-technical'
---

For this article, remember that at the end of every sprint, each story is either marked as done or not done. Also
remember that every story needs to be broken in to chunks of work in which something of business value can be delivered.


I think I've heard it several times now that no one does Scrum perfectly. Although I don't think Scrum is meant to be
followed rigorously as people would often want, the point is that it is a framework that allows teams to organize and
empower the members to be awesome.

I'm currently on a team who adopted a flow of work based around their needs at the time and its very Scrummy. Scrummish?
Scrum-like? To the point that any one on the outside looking in will easily say "they are doing Scrum". The toolset is
largely based around Jira and there are many points of automation so the previous members were definitely moving toward
continuous integration and continuous deployment. I had one knee-jerk reaction when I saw the gitflow model they use
which is everything runs off the master branch. I believe this is called the Github Flow. The other new guy and I spoke
up and said, "hey we should change this" and were met with the old adage "if it ain't broke, don't fix it". 

Here's the model I made based around what is the current strategy.

![Github flow](/assets/images/gitflow.png)

It seems simple enough and as they say, it's worked for years without an issue. So then, why do I want to change it?
Simply put, it isn't exactly working flawlessly and doesn't account for out of flow processes, specifically, hotfixes.

When I first arrived, hotfixes were being applied by ssh-ing in to the production server and live coding. I'm not
going to chastise this behavior as I have done it several times myself for small fixes that otherwise would take more
time to implement properly and deploy than to just fix live then make a separate commit to the code base to account
for it. There is a time and a place for this style of wild west behavior, but some times a hotfix is more than a few
characters and needs a commit and tests and QA effort.

Here's where things get dicey. When a bug is discovered mid sprint and a feature has already been tested, built and
tagged for release it is now in the master branch. Then if we need to hot patch production, it will have to include
anything that has been tagged but not demoed or approved by our product owner. It was technically accurate but not "done
done". Now the hotpatch goes out with code that hasn't been through the business processes, or some other weird work
around happens where you branch from the tag that's in production and deploy that, then apply that branch again to the
master branch so it can be tagged appropriately going through the build process and regression tests, etc.

Here's my git-flow diagram showing how it integrates with Scrum processes.

![Git-flow](/assets/images/scrum-git-flow.png)

The biggest interaction between Scrum and git in this scenario is the sprint demo where stories are approved or returned
for more work. Since both git-flow and Scrum are based around the concept of the release, the concepts line up well with
each other. On top of that, git-flow deals with hotfixes inside the release cycle as well as dealing with broken
regression tests after merging all the accepted features in to the release candidate.

### To be fair...

Github flow is billed as not only easy for any developer or release manager to wrap their heads around, it's also very
suitable for any continuous deployment strategy. Here's why; the master branch is supposed to be able to be deployed at
any time because all tests pass and presumably any product owner who has any say in the code base has approved the
feature code before the merge back to master.

Perhaps the github flow could be modified by my team to be more inclusive of the Scrum process of needing to be approved
before merging and tagging. We would probably have a branch that we call release candidate and do a regression test on
it during the sprint so that we know for sure if we need to fix tests or code before the demo.

I think the point here is that the tools and processes are secondary to the people and the interactions. So long as we
are a functioning team and can do awesome things, no one is going to care what git workflow we used.

