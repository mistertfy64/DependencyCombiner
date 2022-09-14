![DependencyCombiner](./dependencycombiner.png)
---
## What
DependencyCombiner is a `node.js` script that combines dependenices from two `package.json` files.

## Usage
```
node index.js /path/to/file1.json /path/to/file2.json /path/to/outputfile.json
```
## Disclaimer
I made this in like two hours, so expect it to break. This also doesnt update your actual dependenices (`npm i`).

## License
MIT

## Why (Personal Opinions Ahead)
Due to my poor design choices for my commerical-hobby math webgame [Mathematical Base Defenders](https://mathematicalbasedefenders.com), the repository containing the source code for the regular website and the repository containing the source code for the `play` subdomain, that is, the game website, are two seperate repositories.

I don't feel its ethical to leave out npm packages that were used in the `play` subdomain to not be in the Open Source Acknowledgements page.

Therefore, I created this.
