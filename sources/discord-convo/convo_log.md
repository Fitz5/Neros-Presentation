fitz5
fitz5
Online
All India Radio, Aspecte





Text Channel
pid-tuning
Thread
Thread:fitz5 AOS UL7
Search PIDtoolbox

fitz5 AOS UL7 chat
fitz5 AOS UL7
Started by 
HillbillyFPV
April 14, 2026
Jump

fitz5 — 4/14/2026 5:26 PMTuesday, April 14, 2026 5:26 PM
Hello everyone! I am new here, looking for some help filter tuning. More specifically, I have an AOS UL7 that I am trying to dial the filters in. 

I have attached a cruise flight I did in log1. There seems to be a pretty nasty harmonic around 60% throttle in log 4 which I attribute to prop / airflow buffeting against action cam.

For my question. In log 1, it seems that I still have quite a bit of D-term noise post filtering. I am currently running the d-term suggested by Chris Rosser's UL7 tune with the biquad. Would I benefit from switching to two PT1 filters? Is there a way to tune d-term filters? Or should I just use lp1 at 75-100 and lp2 at static 100? 

Motors are getting significantly warmer now as the spring temperatures are heating up.

Thanks everyone!

Delete

Delete

btfl_001.bbl.zip
6.97 MB
Delete
Download

btfl_004.bbl.zip
3.84 MB
Delete
Download

HillbillyFPV — 4/14/2026 8:44 PMTuesday, April 14, 2026 8:44 PM
Hey fitz, continue here 

1
Add Reaction

fitz5 — 4/14/2026 8:44 PMTuesday, April 14, 2026 8:44 PM
Sounds good!
[8:47 PM]Tuesday, April 14, 2026 8:47 PM
I did another test, not very scientific as I was just wobbling around, but i used lp1 at 70-100 and lp2 at 100. here were the results

Delete

HillbillyFPV — 4/14/2026 8:58 PMTuesday, April 14, 2026 8:58 PM
Hello fitz.. glad to have you bro!! Now that you have access to the patreon channels, check out ⁠pid-tuning-basics and ⁠pid-tuning-playlist just to get you started down this tuning rabbit hole! lol Lots and lots to take in so expect a long journey. 

To answer your question, yes you'd be better off using 2 PT1's, and yes you can tune dterm filtering. 
So to change your strategy just a bit, right now, your rpm weights is 100, 0, 80. We never turn off the 2nd harmonic. The fact that you have the second harmonic disabled in rpm filters and your DN min set to 150hz, this is forcing both your DN filters to set at the 2nd harmonic to cover that noise as seen in the pic below. 

What I would do is, 
dterm filters ->
PT1 PT1 with slider at 1.0 (for now)
DN filters ->
min 100hz
RPM filters ->
In CLI.. 
set rpm_filter_weights = 100,40,80

This would let rpm filters take care of all the motor noise and allow DN's to roam where needed. Make these changes and log again.


1

1
Add Reaction

fitz5 — 4/14/2026 9:01 PMTuesday, April 14, 2026 9:01 PM
Legend!
[9:03 PM]Tuesday, April 14, 2026 9:03 PM
Silly mistake there on my end, thanks for catching the rpm notch being off!
[9:04 PM]Tuesday, April 14, 2026 9:04 PM
I have consumed everything I can regarding tuning I could find on YT, currently on lecture two of the filter series from the playlist!
[9:05 PM]Tuesday, April 14, 2026 9:05 PM
From my understanding. D term is just applifying the noise that is not being filtered from the gyro. So, I am chasing the unfiltered second harmonic in D-term? (edited)Tuesday, April 14, 2026 9:05 PM
[9:06 PM]Tuesday, April 14, 2026 9:06 PM
Sorry, how do I interpret your image?

fitz5 — 4/14/2026 9:12 PMTuesday, April 14, 2026 9:12 PM
Ahh, I see! With rpm  2 turned off, dyn 2 sits right ontop of the motor band, with dyn1 shifted but following. Wow, never looked at that graph before. Super helpful!

1
Add Reaction

HillbillyFPV — 4/14/2026 9:14 PMTuesday, April 14, 2026 9:14 PM
That image is freq vs time. In the spectrum you'll see all the max noise from the log. In freq vs time, you see the noise as it happens over time. I cut out the takeoff as usual, so it begins on left side right after takeoff then continues to the right with the seconds displayed at the bottom. I changed the color to grey so the DN filters can be easily seen. (red) you can see exactly where they're hitting. 
This is what it looks like when you first open it. 

Take you some time, watch through all the videos that you can and read the basics guide so you can get a good idea on how we do stuff here so I don't have to repeat all this info. If you'll look at the right side of each graph that you open, you'll see a quick guide.. click that and you'll see what this page does and what it's used for.


1
Add Reaction
[9:15 PM]Tuesday, April 14, 2026 9:15 PM
We use the spectrum and freq vs time both when tuning filters

fitz5 — 4/14/2026 9:18 PMTuesday, April 14, 2026 9:18 PM
Great, thank you. Sorry, took me a second to figure out what the red lines were (in the greyscale img). Would you believe I am an ME? lol (edited)Tuesday, April 14, 2026 9:19 PM

1
Add Reaction
[9:19 PM]Tuesday, April 14, 2026 9:19 PM
Let me make those changes and run out for a hover test. Again, really appreciate it hillbilly!!!

1
Add Reaction

HillbillyFPV — 4/14/2026 9:24 PMTuesday, April 14, 2026 9:24 PM
I'll be going to bed soon.. 9:22pm here and get up at 4am to go to work. 
Look at how we do hover and hover/wobble logs. We can usually get a quad tuned up using these methods of gathering data. Wobbling is just where you go up to a hover, about head high, and wobble the roll and pitch axis at the same time for 30-60 seconds or so. Read the basics thread and it'll explain how to set it all up.

fitz5 — 4/14/2026 9:47 PMTuesday, April 14, 2026 9:47 PM
No worries! Looking much better (i think lol). Motors look less noisy overall which is telling.  Couldnt do much more than hover bc i didnt want to wake the neighbors.

Delete

Delete

Delete

fitz_rpm+dyn_changes.bbl.zip
1.15 MB
Delete
Download
[9:49 PM]Tuesday, April 14, 2026 9:49 PM
Let me reset pids to default tmrw morning and I will do full hover + tune and I will post all of my results.

fitz5 — 4/14/2026 9:56 PMTuesday, April 14, 2026 9:56 PM
looks like dyn 1 is sitting on the first motor harmonic. I know there is a frame harmonic around 200hz, which is what dyn 2 is targeting.

Delete
April 15, 2026

HillbillyFPV — 4/15/2026 4:51 AMWednesday, April 15, 2026 4:51 AM
Hint of the day =  You can post the logfile directly without zipping when it's 10mb or less.

Ok you got your DN's working like they should. Now, before making any other changes to better your filtering, I'd really like to see you learn how to wobble and do wobble logs. This is really handy for filter and pid tuning. Give it a go and see if you can do it manually. If you have trouble, there's a wobble script that you can configure on your radio that will auto wobble for you. Wobble logs better represent the noise of real flight so it's better for filter tuning. You'll be able to further reduce your filtering once you get to wobble logs down. 

Before I leave for work, you can see how your front 2 motors are 20hz higher in freq than the back 2 motors, this means the front motors are working a little harder than the back. This isn't terrible, but it means your CoG is off a bit. If you have the room, scoot your battery back a bit. You're not going for perfect here but it can be improved a bit.


CedRic — 4/15/2026 4:54 AMWednesday, April 15, 2026 4:54 AM
Could be interesting also to know which ESC firmware he is using and which settings are.
[4:57 AM]Wednesday, April 15, 2026 4:57 AM
Which motors / props combo also

1
Add Reaction

fitz5 — 4/15/2026 11:40 AMWednesday, April 15, 2026 11:40 AM
Okay here is a better description of my setup:

Frame: AOS UL7. Carrying Action 6 + 6s1p rs50 lion
Motors: Emax 2807 1300kv
Props: hqprop dp 7x3-5x3pc
FC: Hobbywing F7
ESC: Hobbywing XRotor Micro 65A 4-in-1 ESC, BLHeli32, stock esc settings (would have to check)
Capacitor: 1x680uF

PD balance test:
ran at 1.0, 1.2, 1.3 and 1.4. 1.4 looks good for both. Maybe just need a slight bit more dampening on pitch. will bump pitch D slider to 1.05

Master mult test:
Seeing basically no help from increasing slider from 1.0 to 1.3 other than maybe 2ms. Will leave at 1.0 to stay conservative

Final verdict:
Upped I gain to 0.9 as I heard from a video that bigger quads may need slightly less. FF brought up up 0.9 aswell.

frequency screenshot is from flight 1 of master mult wobble test. no i gain no ff, mm at 1.0.
logs are the first flight and mm wobble test.
I think i have a little too much filter delay, especially in D, but motors are getting considerably hotter now, but still okay to hold. Fine to leave as is?

Again thanks for help, please let me know if I need to provide anything else!

Delete

Delete

Delete

Delete

Delete

fitz_log1_hoverflight_methodB.bbl
8.54 MB
Delete
Download

btfl_004.bbl
2.89 MB
Delete
Download

btfl_003.bbl
3.40 MB
Delete
Download

btfl_002.bbl
2.87 MB
Delete
Download

btfl_001.bbl
2.71 MB
Delete
Download
[11:42 AM]Wednesday, April 15, 2026 11:42 AM
Last thing to note, I was having some weird windup issue when trying to wobble in angle. All mm tests done in manual

HillbillyFPV — 4/15/2026 12:29 PMWednesday, April 15, 2026 12:29 PM
You should’ve let us help walk you through the method the first time. Pitch D is over damped and you skipped pitch to roll balance. And when you do these step test, always go in steps of .2 so you can see the progress easier. 
So back up, reduce pitch damping until the curve looks more like roll, then keeping that ratio on pitch, take both pitch sliders up until pitch delay closely matches roll delay. Use SP-gyro delay instead of filter delay for this. Everything in .2 increments.

1
Add Reaction
[12:32 PM]Wednesday, April 15, 2026 12:32 PM
THEN, do your MM step test again. Start at 1.0, then 1.2, 1.4, 1.6. Then plot them in order and all at once. You want to see it be to much so you’ll know where the top is.

CedRic — 4/15/2026 1:51 PMWednesday, April 15, 2026 1:51 PM
btfl004:
Filtering:
Gyro Filtering: You don't need  its LPF1 --> Disable it. Keep Gyro Slider ON and push it a bit (1.2-1.3),
DTerm Filtering: Enable back ON the DTerm Slider (yet, it's OFF) and make sure values are correct.,
RPM Filter:,
Larger motors + Larger props + Low KV --> Motor noise starts lower than a basic 5" --> RPM MInHz 80 + CLI : set rpm_filter_fade_range_hz = 30,
RPM W 100,40,80 -->  your 2nd harmonic is bit strong... I would suggest RPM W 100,60,70,
DNF: N=2, but you need to clean a bit more your frame resonances --> Q300, MinHz90, MaxHz 450.,
 (edited)Wednesday, April 15, 2026 1:54 PM


1
Add Reaction
[1:54 PM]Wednesday, April 15, 2026 1:54 PM

[1:56 PM]Wednesday, April 15, 2026 1:56 PM
Your motors start to get warm because your filtering strategy is not as good as it would be:


1
Add Reaction

CedRic — 4/15/2026 2:01 PMWednesday, April 15, 2026 2:01 PM
As @HillbillyFPV suggested, you are bit over-damped here, specially on Pitch axis... You need to make some changes regarding to this.
Indeed, as you will get less D gain, your D-Term noise will be lower than currently.

Filtering changes + PID changes would help to get better post-filtered gyro signal --> better post-filtered D-Term signal... and best step response + setpoint / gyro delay.



1
Add Reaction
[2:06 PM]Wednesday, April 15, 2026 2:06 PM
These are some advice



1

1
Add Reaction

fitz5 — 4/15/2026 8:51 PMWednesday, April 15, 2026 8:51 PM
Wow, thanks so much for the feedback!

Allow me to respond to each of these.

1) Hillbilly
I have done the pidtoolbox method a couple times now, albeit maybe with a few changes. It's interesting to hear that it is over damped, i was actually pretty happy with the results! lol. Anyways, i thought they both converged to being critically damped or close to it. From my PD balance test, I assumed that the first one with no overshoot must mean that the dampening ratio was now > 1 and close if not slightly overdamped.

I skipped pd of 1.1 bc i assumed I would be able to interpolate after the fact and got data for the rest. 0.2 increments would make more sense :p

I turned pitch to 1.05 as I thought it may need slightly more based on step response from PD tests and intuitively because there is more inertia along that axis.

I can certainly go back and retune. If the quad is overdamped, would that negate changes in MM?

Delete
[8:52 PM]Wednesday, April 15, 2026 8:52 PM
Pasted PD for reference
[8:53 PM]Wednesday, April 15, 2026 8:53 PM
2) Cedric
This will be more me thinking out loud so I can learn->

No lowpass because the noise floor is already sufficiently low or becuase we dont need to attenuate the high freq noise more.,
Bring up gyro low pass becuase the motor harmonics + other noise dont start untill 120 ish Hz,
Not too sure about this. Is this a Betaflight thing? When I enable it, nothing changes which I assume is good,
-Makes sense as we can see the motor harmonic dipping below 100Hz. And I assume narrowing the fade range, is just decreasing the attentuation that betaflight puts it at low throttle to compensate.
Makes sense. But it seems that it needs to be relative to something. Is it just relative to motor harmoic 1 in db as a percent? I.e. the proporational increase from the noise floor for each harmonic. Assuming harmonic 1 is 100% at 0db, then harmonic 2 would be 80% if at 10db?,
Are you seeing the tiny spike on pitch at 80-90hz which means min should decrease? And then max at 450Hz becuase the noise floor drops below -30db?,

@CedRic
These are some advice

fitz5 — 4/15/2026 8:58 PMWednesday, April 15, 2026 8:58 PM
Again thinking out loud:

I term cutoff should be lowered bc its a bigger build.,
Q factor decrease so notch increases. But how do you know how big the notch actually is?,
-Dshot 300 for reliability?
I have a GPS on my quad for pos hold. are you indicating that I should turn the feature off?,
-Increase D term low pass beacuse once other filter changes + pids then the d term wont be as noisy


I will make changes tmrw morning and collect a log to post. Interested to hear your thoughts regarding d tuning and what / why I did it wrong.

Oh last thing I will mention. Reliability is the name of the game for me, but not exactly sure how to optimize for that. Maybe esc settings? (JB mentioned doing anything with blheli config these days is weird) (edited)Wednesday, April 15, 2026 9:05 PM
[8:58 PM]Wednesday, April 15, 2026 8:58 PM
Again, super helpful stuff guys, thank you thank you :D!!! (edited)Wednesday, April 15, 2026 8:59 PM

2
Add Reaction
April 16, 2026
