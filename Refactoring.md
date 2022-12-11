# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

A short explanation is already there in the comments

- Refactored the code to be scalable to the new features
  - Exported the format data function so that we can have custom format
  - Initiated data validators as we may need to have custom validations for the data
  - Removed redundant code as it was breaking DRY (Do not repeat yourself)
  - Created encryption algorithm following SOLID principles in mind so that we can use the encryption algorithm accordingly
  - Exported `ENCRYPTION_LENGTH` so that we can test for the specific use cases.
  - Tested only the exposed methods
  - If exported as a library it's adaptable to the new changes/features easily.
