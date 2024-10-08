# Embed Bsky - Back-End

Embed your BlueSky feed in any website.

## To-Do

[X] Get returning a feed working
[X] Get database set up and saving
[X] Create a full HTML string for a user's feed
[X] Store that HTML string in S3 and serve it via CDN
[X] Return the CDN URI to the front-end
[X] Improve HTML string and catch edge cases
[X] Switch datetimes to unix for easier math (I am lazy)
[X] Hash usernames in DB / URI so it's harder to guess feed URIs
[X] Add feed-refresher function
[] Make parsing AtProto data a little more bulletproof
[] Improve TypeScript defs - hopefully by using AtProto's defs
[] Write a README that's in any way useful to anyone

## Contributing

I welcome your comments, issues, and pull requests!

If you do contribute code, please use Prettier and adhere to the prettierrc rules. I know some of you hate semi-colons and brackets. I respect that. I think you're deeply weird, but I respect that. Nonetheless, this repo uses them and I won't approve PRs that leave them out. 😘
