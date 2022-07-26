# MykiBalance  
Fetch Myki Balance with Scriptable, add to iOS Widget.    


**Important! This Widget is not affiliated to PTV or Myki. For personal use only.**

The passenger type (Full Fare, Concession, Child etc) may not accurate, feel free to let me know how to fix them

## How to add MykiBalance Widget to my iOS?

1. Download [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188?ign-mpt=uo%3D4) from App Store

2. Add new Script on Scriptable, copy Everything in [MykiBalance.js](https://github.com/imchlorine/MykiBalance/blob/main/MykiBalance.js) and paste to your new Script

3. At this stage,you may see an error message if you try to run the code. Don't worry, You are almost there.

4. Go to your Widgets library and find Scriptable, make sure pick the Middle one and Add Widget to your home screen (Not suport layout for Small and Large Widget).

5. Long press the Widget and go Edit Widget, Choose the `Script` you Added, set `When Interacting` to `Run Script`, so you can manually update your balance by tapping the widget. Input your Myki Card Number into `Parameter` <br />  
         
![setting](https://github.com/imchlorine/MykiBalance/blob/main/setting.jpg)


6. Now you may see the Magic, Enjoy! If not, check your card number agian!

  * Tips: Tap "Top up >" on the Widget, you will be redirected to Official Myki Topup Website in Chrome (you need Chrome installed on your phone).


## How to add the Script to Siri Shortcuts?

 Go to your Scriptable -> Settings -> Siri Shortcuts -> Add Siri Shortcut -> Select the Myki Balance Script -> Add to Siri  
 
 Now try to ask Siri to check your balance.
