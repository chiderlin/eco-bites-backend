# eco-bites-backend

## Function

- make posts
- suggest recipes
- reward recipe & cuisines cards

## tech stack

Backend: Express js
Google cloud service:

- GCS: Store img on cloud
- Google build: Delpoy server to cloud
- Google run: Delpoy server to cloud
- Ai chat - Gemini: Generate recipes suggestion
- Firestore: NoSQL database

## Dependencies

- @google-cloud/firestore
- @google-cloud/storage
- @google-cloud/vertexai
- cors: Allow frontend to call server APIs.
- module-alias: Format developing path
- multer: Handle receiving image/file
- nodemon: auto reload when updating code in local developing.

## AI helper

- ChatGPT: ask coding questions, generate cards images
- Gemini: generate recipes suggestion for app
