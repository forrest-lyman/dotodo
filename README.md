DoToDo
======

DoToDo adds AI coding agents that run in the background and automatically review / resolve any features or bugs in your 
code. Just add `// todo` comments to your code and DoToDo will handle the rest.

```typescript
// todo personalize the greeting
function sayHi() {
  return 'Hi!';
}
```

When you save this file DoToDo will evaluate all of your todos, then resolve them:

```typescript
function sayHi(name: string) {
  return `Hi ${name}`;
}
```

If it doesn't understand or needs more context it adds comments:

```typescript
// todo personalize the greeting for the current user
// @dotodo: please explain how I should get the current user
function sayHi() {
  return 'Hi!';
}
```

Update the todo:

```typescript
// todo personalize the greeting for the current user from state. 
// this is a reducer function and will be passed a state object with `user/displayName`
function sayHi() {
  return 'Hi!';
}
```

"do-to-do...":

```typescript
function sayHi(state: {user: {displayName: string}}) {
  return `Hi ${state.user.displayName}`;
}
```
