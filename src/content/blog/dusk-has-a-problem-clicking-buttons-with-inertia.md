---
title: "Dusk, Inertia, and the Case of the Missing Click"
description: "Why Laravel Dusk often struggles with Inertia.js applications and how to transition to more reliable SPA testing tools like Cypress and Playwright."
publishedDate: 2026-03-04
author: "Alan Asher"
image: "/images/blog/dusk-inertia-problem.png"
tags: ["laravel", "inertia", "vue", "testing", "cypress"]
draft: false
---

If you've ever used Laravel Dusk to test an Inertia.js and Vue.js application, you've likely encountered a frustrating reality: things that should work often don't. A button that is clearly visible on the screen refuses to be clicked, or a navigation assertion fails even though the browser seems to be on the right page.

This combination of tools—Dusk, Inertia, and Vue—tends to "bite" developers because of a fundamental mismatch in expectations. To Dusk, an Inertia app looks like a normal server-rendered application, but under the hood, it behaves very differently.

### The Core Issue

Dusk was built on the assumption of a traditional multi-page application (MPA) lifecycle:
1. A request happens.
2. A full page loads.
3. The DOM stabilizes.
4. You interact with an element.

In contrast, an Inertia + Vue application follows a Single Page Application (SPA) lifecycle:
1. The initial page loads once.
2. JavaScript hydrates the components.
3. Links are intercepted by Inertia.
4. The DOM mutates asynchronously without a full page reload.

When Dusk tries to click an element, it often fails because:
* The DOM element exists, but Vue hasn’t attached event listeners yet.
* The element is replaced by Vue's reactivity system immediately after Dusk finds it.
* The element is visually present but covered by an invisible transition or spinner.
* The Inertia navigation hasn't completed its asynchronous cycle.

### Common Failure Modes and Fixes

#### 1. Hydration Timing
Dusk may see a button before Vue has finished hydrating it. In this state, the click event does nothing. While `$browser->waitFor('@submit-button')` ensures the element exists, it doesn't guarantee it's functional.

**Fix:** Wait for something Vue-dependent, such as specific text that only appears after hydration, rather than just the existence of the element.
```php
$browser->waitForText('Expected Text After Hydration')
        ->click('@submit-button');
```

#### 2. Async Inertia Navigations
Since Inertia navigations are JavaScript-driven, Dusk's expectation of a full page load can cause assertions to fail prematurely.

**Fix:** Use explicit waits for the location or specific conditions.
```php
$browser->click('@edit-link')
        ->waitForLocation('/edit');
// Or use a script evaluation
$browser->waitUntil('window.location.pathname === "/edit"');
```

#### 3. Stale DOM Nodes
Vue re-renders often replace DOM nodes entirely. If Dusk finds an element, and then Vue updates the state, the original node might be detached from the document, leading to "element not attached" errors.

**Fix:** Re-select elements after any state change and avoid chaining long interactions off a single selection.

#### 4. The `<Link>` Component
Inertia’s `<Link>` component doesn't always behave like a standard anchor tag, especially depending on the props used. If standard clicks fail, you might need to trigger the click via JavaScript.

**Fix:**
```php
$browser->script("document.querySelector('[dusk=\"edit-link\"]').click()");
```

#### 5. Invisible Overlays
Vue transitions or loading modals can often overlay elements, making them unclickable according to Selenium/WebDriver, even if they look fine to the human eye.

**Fix:** Wait for the spinner or overlay to be missing before interacting.
```php
$browser->waitUntilMissing('.loading-spinner');
```

### The Golden Rule for Dusk + Inertia

**Never wait for elements; wait for state.**

Instead of just waiting for a button to appear, wait for the application to reach a stable state:
* `->waitForText('Dashboard')`
* `->waitForLocation('/dashboard')`
* `->waitUntilMissing('.loading-spinner')`

---

### Is Dusk the Wrong Tool?

If your application is a deep Vue + Inertia SPA, Laravel Dusk may not be the best fit for interactive testing. Dusk shines when the HTML lifecycle matches WebDriver’s expectations. For modern SPAs, there are better alternatives.

#### 1. Cypress
Cypress is the industry standard for modern SPA testing. It executes directly in the browser, providing superior stability for asynchronous UI interactions.

* **Why it works:** Cypress waits for DOM stability automatically and doesn't assume page reloads. It treats Vue components exactly how a user sees them.

```javascript
cy.visit('/projects')
cy.contains('New Project').click()
cy.url().should('include', '/projects/create')
cy.get('input[name="name"]').type('Test Project')
cy.get('button[type="submit"]').click()
cy.contains('Project saved!')
```

#### 2. Playwright
Playwright is a fast, modern automation tool with excellent cross-browser support and built-in auto-retry logic.

* **Why it works:** It is highly reliable with dynamic SPAs and offers powerful network mocking capabilities with less boilerplate than Selenium-based tools.

#### 3. Vitest + Vue Testing Library
For component-level testing, you don't always need a full browser. Vitest combined with `@testing-library/vue` allows you to test business logic and component behavior in a fast, isolated environment.

---

### Comparison: Dusk vs. Cypress vs. Playwright

| Feature | Laravel Dusk | Cypress | Playwright |
| :--- | :--- | :--- | :--- |
| **SPA Friendly** | ❌ | ✅ | ✅ |
| **Async Handling** | ❌ | ✅ | ✅ |
| **Debug UI** | No | Yes | Yes |
| **API Mocking** | Hard | Yes | Yes |
| **Auto-Wait** | Manual | Auto | Auto |
| **Cross-Browser** | Limited | Chromium+ | Multi |

### Conclusion

For my recent adventure down this rabbit hole, I decided to go with Cypress. I am using multitenancy and cypress seems 
better suited for that use case.

I was able to get rid of selenium out of my docker compose. Cypress runs on my local machine, and has an interface that
records my clicks and keystrokes for me. So writing tests is much easier. The samples it created were easy to follow and 
I used them to help me understand how to write my own assertions.

I'm not so sure if this will be as non-developer friendly as Gherkin is, but I think it's a good start.

