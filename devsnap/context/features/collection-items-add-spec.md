# Collection Items Add

## Overview

Implement collection "create". We need a button in the top bar to create a new collection with a description.

## Requirements

- We should follow the same patterns as items. Collections should be user-scoped, fetch from the server component via lib/db functions and api routes for any client-side calls.
- The create button should open a modal with the fields needed. Show a toast on success or failure. Make sure everything is updated with the new collection on save.