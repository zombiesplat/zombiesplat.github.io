---
title: "From jQuery to VueJS"
description: "Sharing the journey of transitioning from jQuery's DOM-centric approach to VueJS's data-driven model, specifically handling complex checkbox logic."
publishedDate: 2018-02-05
author: "Alan Asher"
image: "/images/blog/jquery-to-vuejs.png"
tags: ["technical", "vuejs", "jquery", "javascript"]
draft: false
---

As I was first making the transition from jQuery to VueJS I was having a hard time grappling with how to migrate the jQuery dependent code I had already developed in to the new Laravel and Vue framework. My problem is probably one that you have run in to several times, the single or none check box. If you’re not familiar, this is where you present the user with a list of options and only want them to select one of those options. From a programming perspective the easiest solution would be a select box.

```html
<select name="select_one">
  <option value="">None</option>
  <option value="option-1">Option 1</option>
  <option value="option-2">Option 2</option>
</select>
```

However, sometimes the UI/UX requirement is to have a list of checkboxes. In the jQuery world, we would write a listener that would uncheck all the other boxes in the group when one was checked.

### The jQuery Approach

In jQuery, we often find ourselves manipulating the DOM directly based on events.

```javascript
$('.highlander').on('change', function() {
    $('.highlander').not(this).prop('checked', false);
});
```

This works, but as the application grows, managing these direct DOM manipulations becomes increasingly complex and error-prone, especially when integrated with other frameworks or complex state requirements.

### The VueJS Way: Data-Driven UI

When moving to Vue, the biggest hurdle is shifting your mindset from "What should this button do to the DOM?" to "How should this button change the data?".

In Vue, we bind our inputs to a data model. For a group of checkboxes where we want to limit selection, we can use a watcher or a method to enforce the "only one" rule within our data.

### Example: Highlander Groups

Suppose we have multiple groups of checkboxes, and within certain groups (let's call them "highlander" groups), only one option can be selected at a time, but they all still need to be part of the same array of selected options for the backend.

```javascript
new Vue({
    el: '#app',
    data: {
        registration_options: [],
        highlander_groups: {
            'group-1': ['option-1', 'option-2'],
            'group-2': ['option-3', 'option-4']
        }
    },
    methods: {
        toggleOption(option, group) {
            const index = this.registration_options.indexOf(option);
            
            if (index > -1) {
                // Option is already selected, so remove it
                this.registration_options.splice(index, 1);
            } else {
                // If it's a highlander group, remove other members of the same group first
                if (group) {
                    this.highlander_groups[group].forEach(member => {
                        const memberIndex = this.registration_options.indexOf(member);
                        if (memberIndex > -1) {
                            this.registration_options.splice(memberIndex, 1);
                        }
                    });
                }
                // Add the new option
                this.registration_options.push(option);
            }
        }
    }
});
```

Now we can see that the `registration_options` element is still an array of values and the few options that need to be limited are appropriately limited to a single option per highlander group.

### Wrap Up

When learning Vue while coming from the jQuery world, just remember to let the data drive the display and your life will be much easier.
