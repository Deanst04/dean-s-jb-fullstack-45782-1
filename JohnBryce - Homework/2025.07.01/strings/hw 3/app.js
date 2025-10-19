const phone = prompt(`please enter your phone number`);

let digCheck = true;
for (let i = 0; i < phone.length; i++) {
    if (phone[i] !== '0' && 
    phone[i] !== '1' &&
    phone[i] !== '2' &&
    phone[i] !== '3' &&
    phone[i] !== '4' &&
    phone[i] !== '5' &&
    phone[i] !== '6' &&
    phone[i] !== '7' &&
    phone[i] !== '8' &&
    phone[i] !== '9') digCheck = false;
};

if (phone.length === 10 && phone.startsWith(`05`) && digCheck) {
    alert(`your phone number is legit`);
} else alert(`your phone number isn't legit`);