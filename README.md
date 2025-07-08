# SlowAsyncApi
Test app that simulates a processing-intensive task. Uses a .NET backend for streaming values and an Angular frontend for displaying them as soon as received

* Enter some text in the input field
* Press the "Run" button to get the following result:
  * All the unique characters from the input string sorted alphabetically and followed by the number of times they are repeated
	* A `/` separator
	* Input string encoded as Base64

Processing is performed on backend where a small pause is added between characters sent.
A new process cannot be started while running. Pressing the "Cancel" button stops the current execution.

## Running the application

To start the backend application, execute the command:
```ps1
dotnet run
```

To run the Angular client, run the command:
```bash
npm start
```
or
```bash
ng serve
```
