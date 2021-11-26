# introduction

`Game.textDOM.innerHTML = '';`
`$('#convo').style.background = "hsl(0, 0%, 10%)";`

welcome to high school! you're already failing!
what do you do?
[do nothing](#do-nothing)
[study harder](#study-harder)
[sleep more](#sleep-more)

# do-nothing

why did you think that was going to work?
honestly, i would do the same. we both fail.
(#try-again)

# study-harder

you studied so much that you didn't sleep for 2 nights in a row. you passed out in class and was expelled.
`_.studied = true;`
(#try-again)

# sleep-more

you sleep
you sleep
and you sleep some more.
{{if _.studied}} (#end-good) {{/if}}
(#try-again)

# try-again

`$('#convo').style.background = "#ff4040";`
try again?
[yes](#introduction)

# end-good

and somehow you graduated?
with honors??
how???

END
play again?

`_.studied = false;`
[yes](#introduction)
