import pywhatkit
from datetime import datetime, timedelta


phone = "+972584621006"
message = "Hi from pywhatkit 👋"

send_time = datetime.now() + timedelta(minutes=1)

hour = send_time.hour
minute = send_time.minute

# Send a WhatsApp Message to a Contact at 1:30 PM
print(f"Sending at {hour}:{minute}") # testing date
pywhatkit.sendwhatmsg(phone, message, hour, minute)


# Same as above but Closes the Tab in 2 Seconds after Sending the Message
# pywhatkit.sendwhatmsg("+910123456789", "Hi", 13, 30, 15, True, 2)


# Send an Image to a Group with the Caption as Hello
# pywhatkit.sendwhats_image("AB123CDEFGHijklmn", "Images/Hello.png", "Hello")


# Send an Image to a Contact with the no Caption
# pywhatkit.sendwhats_image("+910123456789", "Images/Hello.png")


# Send a WhatsApp Message to a Group at 12:00 AM
# pywhatkit.sendwhatmsg_to_group("AB123CDEFGHijklmn", "Hey All!", 0, 0)


# Send a WhatsApp Message to a Group instantly
# pywhatkit.sendwhatmsg_to_group_instantly("AB123CDEFGHijklmn", "Hey All!")


# Play a Video on YouTube
# pywhatkit.playonyt("PyWhatKit")