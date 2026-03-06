---
title: "From Dusk to Cypress: Building a Laravel Testing API for E2E Tests"
description: "How I replaced Laravel Dusk with Cypress for an Inertia + Vue app and built a testing API to control the database, factories, and authentication."
publishedDate: 2026-03-05
author: "Alan Asher"
image: "/images/blog/from-dusk-to-cypress.png"
tags: ["laravel", "cypress", "testing", "vue", "inertia", "php"]
draft: false
---

# From Dusk to Cypress: Building a Laravel Testing API for E2E Tests

After wrestling with **Laravel Dusk, Inertia, and Vue** in my previous post, I decided to try a different approach for browser testing: **Cypress**.

Cypress is excellent for testing modern frontend applications, but moving from Dusk revealed an immediate problem.

Dusk lives *inside* Laravel.  
Cypress lives *outside* the application.

That means we lose something extremely useful:

> The ability to directly manipulate the database using PHP.

With Dusk I could do things like:

```php
User::factory()->create();
Project::factory()->count(3)->create();
```

Then immediately test them in the browser.
Cypress doesn’t have that luxury. So I needed a bridge.
The solution was to build a **testing API inside Laravel**.

---

# The Problem

When writing E2E tests, you often need to:
- reset the database
- create models using factories
- seed test data
- log users in and out

If Cypress can only interact through the browser UI, tests become:
- slow
- brittle
- difficult to set up

Instead, we give Cypress **controlled backend access** during testing.

---

# Building a Laravel Testing API

I created a small set of routes prefixed with `/test`.

These endpoints are only available in development or testing environments.

```php
# routes/web.php
Route::prefix('test')->group(function () {  
    Route::post('/reset', function () {  
        Artisan::call('migrate:fresh --seed');  
        return response()->json(['status' => 'ok']);  
    });  
  
    Route::post('/factory', function () {  
        $class = request('class');  
        $count = request('count', 1);  
  
        return $class::factory()->count($count)->create();  
    });  
  
    Route::post('/login', function () {  
        $user = \App\Models\User::factory()->create([  
            'email' => 'test@example.com'  
        ]);  
  
        Auth::login($user);  
  
        return response()->json(['status' => 'logged-in']);  
    });  
  
    Route::post('/logout', function () {  
        Auth::logout();  
        return response()->json(['status' => 'logged-out']);  
    });  
});
```

This gives Cypress the ability to directly control the application's state.

---

# The CSRF Trap

The first time I tried calling these endpoints from Cypress, Laravel responded with
```
419 Page Expired
```

This happens because **POST routes in Laravel expect a CSRF token**.

Since Cypress isn't submitting one, the request fails before reaching the route.

The easiest solution was excluding the testing routes from CSRF validation.

```php
# bootstrap/app.php
$middleware->validateCsrfTokens(except: [
    'test/reset',
    'test/factory',
    'test/seed',
    'test/login',
    'test/logout',
]);
```

Now Cypress can safely call these endpoints.

---

# Using the Testing API in Cypress

With the backend helpers in place, Cypress commands become simple and powerful.

### Reset the database

```ts
// cypress/e2e/resourceName.cy.ts
beforeEach(() => {
  cy.request('POST', '/test/reset')
})
```

---

### Create models with factories

```ts
// cypress/e2e/resourceName.cy.ts
cy.request('POST', '/test/factory', {
  class: 'App\\Models\\Project',
  count: 3
})
```
This would be useful during the Assemble phase of a test.

---

### Log in instantly

```ts
// cypress/support/commands.cy.ts
Cypress.Commands.add('login', () => {
  cy.request('POST', '/test/login')
})
```

No UI login.  
No waiting for forms.  
Just an authenticated session. I'll probably add some inputs to it later like email, name, and roles.

---

# Example Test

With the testing API available, tests stay focused on **behavior**, not setup.

```ts
describe('Projects', () => {

  beforeEach(() => {
    cy.request('POST', '/test/reset')
    cy.login()
  })

  it('displays a list of projects', () => {

    cy.request('POST', '/test/factory', {
      class: 'App\\Models\\Project',
      count: 3
    })

    cy.visit('/projects')

    cy.contains('Projects')
    cy.get('[data-cy=project-row]').should('have.length', 3)

  })

})
```

The flow becomes:
1. Reset database
2. Create test data
3. Visit page
4. Verify UI

Simple and deterministic.

---

# Safety Considerations

Never expose these routes in production.

Only load them in safe environments.

```php
if (app()->environment(['local', 'testing'])) {
    require base_path('routes/testing.php');
}
```

This ensures the testing API cannot be accessed publicly.

---

# Final Thoughts

Moving from **Dusk to Cypress** initially felt like losing some important tooling.

But by adding a small **testing API layer**, we get the best of both worlds:

- Cypress for modern front-end testing
- Laravel factories and migrations for back-end control

Once the bridge exists, writing tests becomes fast and predictable again.

And that's when browser testing finally starts to feel fun.


---

