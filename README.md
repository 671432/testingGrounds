# Testing Grounds

github pages: https://671432.github.io/testingGrounds/

# Info

just a repo to test certain ideas and maybe implement them in other projects once I managed to do it properly.

the setup for this project will not follow "best practice" as my plan is to have the different "ideas" or "attempts" be in their own folders, including the scripts, styling, pages, etc.
basically, a bunch of projects inside the testing grounds project.

# Planned tests

automate the following process:

[&AgFqLwAA] <- (the first items game link found on the wiki page)

48911 -> BF 0F -> 0F BF <- (the second items ID (has to be upgrade like rune, sigil, mark, etc), convert from decimal to hex, switch the 2 number pairs)

02 01 6a 2f 00 00               <- (first items game link, base64 to hex converter)
               40       00 00   <- (add "40" on the 6th pair, add second items swapped hex values, add "00 00" to the end)
02 01 6a 2f 00 40 0F BF 00 00   <- (add second items swapped hex values)

[&AgFqLwBAD78AAA==]             <- (add the games elements "[&...]")

-------------------


[&AgEYXwAA] <- (the first items game link found on the wiki page)

24887 -> 61 37 -> 37 61  <- (the second items ID (has to be upgrade like rune, sigil, mark, etc), convert from decimal to hex, switch the 2 number pairs)

02 01 18 5f 00 00        <- (first items game link, base64 to hex converter)

02 01 18 5f 00 40 37 61 00 00 <- (add "40" on the 6th pair, add second items swapped hex values, add "00 00" to the end. convert back from hex to base64)

[&AgEYXwBAN2EAAA==] <- (add the games elements "[&...]")

# Sources

Background follows mouse movement: https://gsap.com/community/forums/topic/17959-move-content-on-canvas-background-following-mouse-over/page/2/

Commenter: OSUblake

Posted: March 19, 2018
