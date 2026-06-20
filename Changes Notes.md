My changes:

Slide 1: Get rid of the background png image.
The tittle should extend furthur right
Title: "Fixing a 'perfect' drone"
Subtitle: "An algorithmic approach to drone performance"

Increase the size of my name and the date



Slide 2: The Drone (move to after slide 3)
This slide needs to be reformated. Lets include an image placeholder of drone on the right
Below the image of the drone, include a text box with its specs:
Frame: AOS UL7. Carrying Action 6 
Battery: 6s1p rs50 lion
Motors: Emax 2807 1300kv
Props: hqprop dp 7x3-5x3pc
FC: Hobbywing F7
ESC: Hobbywing XRotor Micro 65A 4-in-1 ESC, BLHeli32
Capacitor: 1x680uF






Slide 3: This will flip with slide 2. this is where the boxes of 01 no visible jello cool smooth motors etc are
Objective:
Create a chase drone to meet certain mission requirements
-70mph capable
-15 mins flight time
-Carry action camera with smooth footage
-Reliable and repeatable performance - highlight this box with slight shading

get rid of pilot level requirement
Deemphisze the numbers, they should all be the same color
text size should be larger and center of focus


slide 4:
Three Coupled Requirement Failures
FAIL HOT and LATE need to be deleted.

Instead, each box should read:
Camera Jello
Hot Motors
Poor Tracking

Each box should be slightly red

Get rid of diagnostic risk. Replace with "the challenge" It is a fresh build with frame specifc presets applied





Slide 5: Diagnostic order: Plant → Sensor → Controller

"Each component impacts the others. iterate as needed"

Slide should start with "Plant-with-feedback-controller.png" centered. Then duplicate the slide as animation and move it top right to stay there.
Then next slide should have the .png in the top right corner. the 01 - 05 should be centered down slightly and sit below the image. 
Get rid of the rule
Increase text size of 01 numbers and main text within boxes.
Grey text should be kept to just a couple words and be larger
01) Physical drone - Mass, stiffness, moutns,  and relative motion
02) Gyro signal - Delete this box
03) Filtering / ESC - Reduce noise and minimize delay
04) PID / Feedforward - Critically damped with minimal error setpoint tracking
05) Final result - delete this box




Slide 6:

Checkpoint: Addressing Mechanical Plant Vibration
Get rid of the question to answer.
Make the three bullets large text center right.
Header of "Progress:
Arrow point to first

There should be some background image to discern when we are at a checkpoint.
Thinking like a background rectangle, fromthe center toright side. It is slightly darker than current background. All three bullter points should sit in it.



Slide 7:
Keep title.
Subtitle: - delete
will have two pictures

left: rolling shutter example.png
right: jello vs freq sketch.png

Move the current textbox down.
Keep physical mechanism
first point: keep text
subtext:delete
second point: Shutter speed and image capture sync with frame harmonics to prouduce visible waves called "jello"


right side of box replace with slide 37 material 
"Waves per frame
nwaves = Tscan × fvib
(0.016 s)(200 Hz) = 3.2 waves / frame 

Phase aliasing
200 Hz / 60 fps = 3⅓ cycles / frame

⅓ cycle × 360° = 120° / frame

Assumptions from slide 37, small bulleted box top right above image


slide 8: 
remove both text boxes. 
included one header on the right:
Observations:
-very high 0db roll amplitude
-Roll amplitude slightly higher than pitch

slide 8.5: Move slide 36 after slide 8.
change title to (RPM Overlay) and drop the with

mimic the style of slide 8 with observations and notes:
First bullet should be: post filtered gyro still leaves small peak at 180hz
second: small peaks at and below 100hz




Slide 9:
200Hz Resonance Was Expected - drop by desgin

3 bullet points. Fix formatting so we dont have smaller unreadable subtext. no nead for header just bullets
-Modal analysis of UL7 frame shows 200hz resonance

-200hz resonance in Chris's build is smaller than motor harmonics

-It should be the first harmonic spike we see in the spectrum



Slide 10:

Suspect: Physcial Relative motion on frame
subtext: "Components on the airframe bending, flexing, and moving at certain frequencies can show up in log file"

The textbox
Canidiate excitation paths - good
Battery motion - good
subtext: A large fraction of the drone mass moving could cause significant amplitude vibration

Flexible antennas
subtext: Antennas can vibrate at resonant frequencies like tuning fork

Loose screws and components
subtext: Loose motor or arm screws may induce play leading to vibration


Phsyical Checks

1) Attempt to torque and bend components on frame looking for movement and flexure
- delete subtext
2) check for wires touching gyro
- delete subtext
3) Tighten motor and frame screws
- delete subtext



Slide 11:

Title: Mechanical Fixes
delete subtext

get rid of evidence status box

Changes made - good

1)Added a second battery strap
2) Modeled and printed antenna mount
3) tightened all screws

Add image to right side. - "post mechanical changes pwer spec denisty.png"


Slide 12: Checkpoint Adjusting Filtering
subtext: "Adjusting filtering without adding too much delay"

copy formatting from slide 6

again get rid of question to answer and copy right side checkpoint


Slide 13:

Title: Balancing Filtering vs Delay
keep subtext

1) D-term amplieiffes high-frequency signal
subtext: d(error)/dt amplifies high frequnecy noise getting through filters

2) Motors run rougher and hotter
subtext: Motors act as mechanical lp1 filters. Cannot actually act on high frequency noise. Translates to heat
This is a test to 


Too much filtering
3) Phase delay increase
Controller reacts later to vehicle motion. Reducing dynamic response like prop wash performance

4) Instability
Higher delay reduces system stability

Strategy: Use the minimum filtering that controls noise without sacrificing delay