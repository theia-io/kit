# Some interesting problems I was lucky to practice & solve

## Instagram like-issue

Once you like someone we don't wring to a "Likes" Table / Document to track all likes.

## Retweet & Comments with quatos to know who retweeted it

Same trick as with Instagram would not work cause with replies. You need to actually track replies and treat them as tweets also to show in the feed. Do we want to show it in the feed?

Therefore for such retweets information and actual retweets we need to fetch all retweets separately for every tweet on the page.

## Every page is The Life organism

All information (tweets, replies, retweets, likes, etc) on the page have to be kept up-to-date.
We can leverage what can seems like a disadvantage for us - a lot of duplicate information created on the Tweet, like, replies etc and its denormalization and duplication inside the DB (afterall we not a bank with transactions and not a medical institute).
Increasingly harder it is to do because of many such information are non-structurally presented to FE in a form of raw data (in a data object part).

For this we will have business layer to actually structure a data in SQL normalized like data (so the BE part (API) is fast because does not need to perform a lot of operations / second and FE part will by thick client side calculating and normalizing data relevant for a user). Likely cannot be cached on Infra side (outside of the client device) (CDN, API Cache, DB Cache) but can be cached on user side / in the client device (Browser, Mobile, Desktop, etc).

## UX from Performance standpoint

In Software with User Interfaces there are many ways to improve performance. Those can be real performance of the systems involved e.g. improving algorithms, machines, TTL, optimizing code and many more. Moreover, performance can be improved also by improving (optimizing business) logic to utlimately make it simpler. At last, we can make none, all or some of the suggested approaches and apply what I called "unexpected" improvements - those that neither User nor BA knows about. Example of such can be Twitter post - once user writing a post system based on some criteria already does all the heavy lifting of post creation - maybe profile population, maybe doing preparation work. At the moment user hits "Post" system only confirms activness of the post by sending light-weight request updating, e.g, field. Such improvements are not feasible today because requires a lot of engineering investments and prone to issues since increase overall complexity of the system. In future, however, possible.

## How to suggest which profile to follow

We can suggest which profiles to follow based on:

- what follows who we follow,
- we worked together in same period in same company
