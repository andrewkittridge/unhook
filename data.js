/* Unhook playbooks. Public cancel paths, not legal advice. Policies move. */
window.PLAYBOOKS = [
  {
    id: "planet-fitness",
    name: "Planet Fitness",
    aliases: ["pf", "planet", "black card"],
    category: "Gym",
    difficulty: "hard",
    blurb: "Phone, email, and the app are not cancel. Home club or certified mail.",
    trap: "They want you in the club so a manager can save you. Corporate HQ mail is a black hole. Billing often drafts on the 17th — a letter that arrives the 18th buys another month plus the annual fang.",
    fails: [
      "Calling or emailing corporate",
      "Mailing the Florida headquarters",
      "Tapping Cancel in the app and assuming it stuck",
      "Verbal cancel with no signed copy"
    ],
    path: "Certified mail to your home club, or in person with a signed form.",
    steps: [
      { title: "Find the home club street address", body: "The gym you joined — not HQ. Club locator on planetfitness.com or your original agreement. You need the street address, not a PO box." },
      { title: "Fill the letter. Sign in ink.", body: "Name as on the agreement, DOB, keytag / member ID, address, phone. Ask for written confirmation and a stop on all EFTs including the annual fee." },
      { title: "USPS certified mail, return receipt", body: "PS Form 3800 plus the green return card. Keep the tracking slip. Delivery date is the legal clock, not the day you dropped it." },
      { title: "Watch the 17th", body: "If dues draft after the return receipt date, you have paperwork for the bank and the club. Screenshot the confirmation if they ever send one." }
    ],
    scriptTitle: "At the desk (if you go in)",
    script: [
      { who: "you", text: "I am here to cancel my membership today. I need the cancellation form and a signed copy before I leave." },
      { who: "them", text: "Have you tried the app? We can freeze instead. The manager can take 20% off." },
      { who: "you", text: "I am not freezing and I am not changing plans. Please process the cancel and give me the signed copy now." }
    ],
    letter: {
      toLabel: "Home club street address",
      defaultTo: "[Home club street address — not HQ]",
      extraFields: [
        { key: "club", label: "Home club name", placeholder: "PF Downtown" },
        { key: "memberId", label: "Keytag / member ID", placeholder: "Keytag number" },
        { key: "dob", label: "Date of birth", placeholder: "MM/DD/YYYY" }
      ],
      subject: "MEMBERSHIP CANCELLATION — {{fullName}}",
      body: "{{today}}\n\nPlanet Fitness, {{club}}\n{{to}}\n\nRE: MEMBERSHIP CANCELLATION, {{fullName}}\n\nTo whom it may concern:\n\nI am writing to cancel my Planet Fitness membership, effective immediately.\n\nMember name: {{fullName}}\nDate of birth: {{dob}}\nKeytag / member ID: {{memberId}}\nAddress on file: {{address}}\nPhone on file: {{phone}}\n\nPer my membership agreement, this letter is my written notice of cancellation. Please stop all future electronic funds transfers, including monthly dues and the annual fee, and send written confirmation to the address above.\n\nSignature: ____________________\n{{fullName}}\n"
    },
    cancelBy: { kind: "before-day", day: 17, mailBuffer: 7, hint: "Typical draft is the 17th. Mail a week early so the club receives it first." },
    typical: 22
  },
  {
    id: "siriusxm",
    name: "SiriusXM",
    aliases: ["sxm", "sirius", "xm radio"],
    category: "Music",
    difficulty: "hard",
    blurb: "Retention is the product. Chat beats hold music. Decline three times. Get a number.",
    trap: "The online cancel path dumps you into a retention agent authorized to cut the bill ~75%. The call is 20–45 minutes if you let it be. Prepaid car trials convert after you already forgot.",
    fails: [
      "Hanging up without a confirmation number",
      "Accepting a 12-month promo you did not want",
      "Cancelling streaming but leaving the car radio plan live",
      "Assuming the trial died when you sold the car"
    ],
    path: "Chat at care.siriusxm.com, or 1-866-635-2349. Screenshot the transcript.",
    url: "https://care.siriusxm.com",
    phone: "1-866-635-2349",
    steps: [
      { title: "Decide: out, or the cheap rate", body: "Retention will offer $5–$9/mo. If you want that, say so after the second decline. If you want out, do not bargain." },
      { title: "Open chat (preferred) or call", body: "Chat leaves a transcript. Car-radio plans usually require a live agent; chat counts. Streaming-only plans can die in the account center." },
      { title: "Read the script. Decline twice.", body: "Do not explain your life. After the second no, ask for the confirmation number and an email." },
      { title: "Watch three statements", body: "SiriusXM has been sued for billing after cancel. Keep the transcript. Dispute with the card if a draft posts after the confirmation date." }
    ],
    scriptTitle: "Retention — you want out",
    script: [
      { who: "you", text: "I need to cancel my SiriusXM subscription for this radio ID. I am not interested in retention offers. Please confirm cancellation in this chat and by email." },
      { who: "them", text: "I can do 12 months at $5.99 — that's 70% off." },
      { who: "you", text: "I appreciate it. I still want to cancel. Please process it and give me the confirmation number." },
      { who: "them", text: "Let me transfer you to a supervisor who has more options." },
      { who: "you", text: "I do not want a transfer. Please cancel now and send the confirmation. My decision is final." }
    ],
    letter: {
      toLabel: "SiriusXM (backup, if they bounce chat)",
      defaultTo: "Sirius XM Radio Inc., 1221 Avenue of the Americas, New York, NY 10020",
      extraFields: [
        { key: "memberId", label: "Radio ID / account", placeholder: "Radio ID" }
      ],
      subject: "CANCELLATION — account {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease cancel SiriusXM account / radio ID {{memberId}} for {{fullName}} at the end of the current paid period. I decline all retention offers. Send written confirmation to {{address}} / {{phone}}.\n\n{{fullName}}\n"
    },
    cancelBy: { kind: "watch-window", hint: "Cancel any day. Service runs to the end of the paid period. Watch the next three drafts." },
    typical: 23
  },
  {
    id: "adobe",
    name: "Adobe",
    aliases: ["creative cloud", "photoshop", "acrobat"],
    category: "Software",
    difficulty: "hard",
    blurb: "Annual plans hide a 50% goodbye fee on the last screen. The 14-day window is the clean exit.",
    trap: "Guilt screens, then the fee. Annual prepaid looks cheaper until you leave mid-year. Chat can waive the ETF; the site will not advertise that.",
    fails: [
      "Uninstalling the apps",
      "Cancelling after day 14 without reading the fee line",
      "Confirming cancel while the fee still shows a number",
      "Leaving Acrobat or a stock-photo add-on live"
    ],
    path: "account.adobe.com → Plans → Manage plan → Cancel. Read the fee before Confirm.",
    url: "https://account.adobe.com",
    steps: [
      { title: "Check the 14-day clock", body: "Purchase or renewal within 14 days: full refund path. Outside it: annual plans often charge 50% of remaining months." },
      { title: "Walk the site cancel", body: "Plans → Manage plan → Cancel your plan. Skip every 'switch instead' screen. Stop on the fee line." },
      { title: "If the fee is not $0, open chat", body: "Ask for a courtesy waiver of the early termination fee. Decline plan-switch offers unless a month-to-month restart is the only $0 path." },
      { title: "Screenshot Confirm", body: "The confirmation email is the artifact. If payment is processing, the button greys out — wait 24 hours." }
    ],
    scriptTitle: "Chat — fee waiver",
    script: [
      { who: "you", text: "I need to cancel Creative Cloud. Please waive the early termination fee as a courtesy and confirm the cancel fee is $0 before I click Confirm." },
      { who: "them", text: "I can move you to Photography Plan / offer two free months." },
      { who: "you", text: "I do not want a different plan. Please waive the ETF or show me the $0 cancel path, then send confirmation." }
    ],
    letter: {
      toLabel: "Adobe (dispute backup)",
      defaultTo: "Adobe Inc., 345 Park Avenue, San Jose, CA 95110",
      extraFields: [
        { key: "memberId", label: "Adobe ID / email", placeholder: "account email" },
        { key: "order", label: "Order / confirmation", placeholder: "Order number" }
      ],
      subject: "CANCELLATION AND ETF DISPUTE — {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease cancel all Adobe subscriptions on Adobe ID {{memberId}} ({{fullName}}). Order {{order}}.\n\nI request cancellation with a $0 early termination fee and written confirmation to {{address}}. If a 50% fee was assessed after I requested cancel, treat this as a dispute of that charge.\n\n{{fullName}}\n{{phone}}\n"
    },
    cancelBy: { kind: "notice-days", noticeDays: 14, hint: "Day 14 after purchase or renewal is the clean refund line. After that, read the ETF before you confirm." },
    typical: 55
  },
  {
    id: "xfinity",
    name: "Xfinity",
    aliases: ["comcast", "comcast xfinity"],
    category: "ISP",
    difficulty: "hard",
    blurb: "Retention, then the modem. No confirmation number means you did not cancel.",
    trap: "The phone tree is a discount funnel. Temporary promos expire and the rate resets higher. Unreturned gear becomes a bill that looks like you are still a customer.",
    fails: [
      "Hanging up without a confirmation number",
      "Leaving the modem / router in a closet",
      "Cancelling TV and assuming internet died",
      "Skipping the ETF check before you start"
    ],
    path: "1-800-XFINITY. Say cancel service. Decline the save. Get the number. Return gear in 10 days.",
    phone: "1-800-934-6489",
    url: "https://www.xfinity.com/support",
    steps: [
      { title: "Read the contract before you call", body: "xfinity.com → My Account → Plan Details. Note remaining ETF. If savings beat the ETF in a few months, pay it and leave." },
      { title: "Call. Say cancel, not 'cheaper'.", body: "Cheaper routes you to billing. Cancel routes you to retention. That is the desk that can actually stop the account." },
      { title: "Read the script. Get the number.", body: "Effective date, confirmation number, equipment return (store vs UPS kit). Ask them to email it." },
      { title: "Return every box", body: "Store drop or UPS kit, usually ~10 days. Keep the receipt. An unreturned gateway is a new bill." }
    ],
    scriptTitle: "Retention",
    script: [
      { who: "you", text: "I have made a final decision to cancel. I am not looking for a different rate or plan. Process the cancellation today and give me a confirmation number." },
      { who: "them", text: "I can take $30 off for 12 months if you stay." },
      { who: "you", text: "I am not staying. Please complete the cancel, email the confirmation number, and tell me how to return the equipment." }
    ],
    letter: {
      toLabel: "Xfinity / Comcast (written backup)",
      defaultTo: "Comcast Cable, Attn: Cancellation, P.O. Box 70291, Philadelphia, PA 19176",
      extraFields: [
        { key: "memberId", label: "Account number", placeholder: "Xfinity account #" }
      ],
      subject: "SERVICE CANCELLATION — {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease cancel all Xfinity services on account {{memberId}} at {{address}}, effective the end of the current billing cycle. I decline retention offers.\n\nSend a confirmation number and equipment-return instructions to {{fullName}}, {{phone}}.\n\n{{fullName}}\n"
    },
    cancelBy: { kind: "watch-window", hint: "Ask for the last-bill date on the call. Return equipment within the window they give you (often 10 days)." },
    typical: 89
  },
  {
    id: "la-fitness",
    name: "LA Fitness",
    aliases: ["lafitness", "l.a. fitness"],
    category: "Gym",
    difficulty: "hard",
    blurb: "Often 30-day written notice to the home club. Freeze is not cancel.",
    trap: "Prepaid annual and 'month-to-month' still want written notice. Clubs push freeze. A freeze that auto-resumes is how people pay for a gym they stopped using in March.",
    fails: [
      "Emailing a general inbox",
      "Freezing and forgetting the resume date",
      "Mailing corporate instead of the home club",
      "No copy of the signed cancel form"
    ],
    path: "In person at the home club or certified mail. Read your agreement for the notice window.",
    steps: [
      { title: "Read the notice clause", body: "Many agreements want ~30 days written notice. Start the clock before the next draft, not after." },
      { title: "Home club, signed form", body: "Ask for the cancellation form. Sign. Take a photo of their copy and yours before you leave." },
      { title: "If you cannot go in, certified mail", body: "Same letter pattern as other gyms. Home club street address. Return receipt." },
      { title: "Watch two cycles", body: "If they draft after the notice date, the signed form or green card is the dispute packet." }
    ],
    scriptTitle: "Front desk",
    script: [
      { who: "you", text: "I am cancelling. I need the official form and a stamped copy today. I am not freezing." },
      { who: "them", text: "You can freeze for $15 and keep the rate." },
      { who: "you", text: "No freeze. Please process the cancel and give me the copy." }
    ],
    letter: {
      toLabel: "Home club street address",
      defaultTo: "[LA Fitness home club street address]",
      extraFields: [
        { key: "club", label: "Home club", placeholder: "Club name" },
        { key: "memberId", label: "Member ID", placeholder: "Member ID" }
      ],
      subject: "MEMBERSHIP CANCELLATION — {{fullName}}",
      body: "{{today}}\n\nLA Fitness, {{club}}\n{{to}}\n\nPlease cancel membership {{memberId}} for {{fullName}}, effective at the end of the contractual notice period. I decline freeze or rewrite offers. Stop all EFTs and send written confirmation to {{address}}, {{phone}}.\n\nSignature: ____________________\n{{fullName}}\n"
    },
    cancelBy: { kind: "notice-days", noticeDays: 30, hint: "Many clubs want ~30 days written notice. Confirm on your agreement." },
    typical: 32
  },
  {
    id: "anytime-fitness",
    name: "Anytime Fitness",
    aliases: ["anytime", "af gym"],
    category: "Gym",
    difficulty: "hard",
    blurb: "Franchise gym. Your club's agreement is the law. Written notice, not a Facebook message.",
    trap: "Each franchise writes its own cancel clause. Some want in-person, some want certified mail, some want 30 days. Corporate cannot cancel a franchise membership.",
    fails: [
      "DMing the brand account",
      "Calling corporate",
      "Email with no delivery proof",
      "Assuming the keyfob deactivation cancelled billing"
    ],
    path: "Read the agreement. Then written notice to the home club the way it specifies.",
    steps: [
      { title: "Find the cancel clause", body: "Your PDF or the copy they handed you at signup. Notice days, method, address." },
      { title: "Do that method only", body: "If it says in person, go. If it says mail, certified with return receipt. Do not substitute email unless the clause allows it." },
      { title: "Keep the artifact", body: "Signed form, tracking, or email with a human's name and date." },
      { title: "Annual fee calendar", body: "Some clubs bill an annual on a fixed month. If you are inside that window, move faster." }
    ],
    scriptTitle: "Home club",
    script: [
      { who: "you", text: "I am cancelling per my agreement. I need the form you require and proof of the date you received it." },
      { who: "them", text: "Corporate handles that." },
      { who: "you", text: "This is a franchise membership. Please process it here or give me the address the agreement names." }
    ],
    letter: {
      toLabel: "Home club (from your agreement)",
      defaultTo: "[Anytime Fitness home club address from your agreement]",
      extraFields: [
        { key: "club", label: "Club name", placeholder: "Anytime Fitness …" },
        { key: "memberId", label: "Member ID", placeholder: "Member ID" }
      ],
      subject: "MEMBERSHIP CANCELLATION — {{fullName}}",
      body: "{{today}}\n\n{{club}}\n{{to}}\n\nPlease cancel my Anytime Fitness membership {{memberId}} ({{fullName}}) per the written-notice terms of my agreement. Stop all future drafts including any annual fee. Send written confirmation to {{address}}, {{phone}}.\n\nSignature: ____________________\n{{fullName}}\n"
    },
    cancelBy: { kind: "notice-days", noticeDays: 30, hint: "Franchise rules vary. Default to 30 days written unless your agreement is kinder." },
    typical: 45
  },
  {
    id: "spectrum",
    name: "Spectrum",
    aliases: ["charter", "spectrum internet"],
    category: "ISP",
    difficulty: "hard",
    blurb: "Retention plus equipment. Chat can work. The last bill is where they hide the modem.",
    trap: "Promos, mobile lines, and unreturned gear. Cancelling internet does not always kill Spectrum Mobile or the TV add-on.",
    fails: [
      "Skipping equipment return",
      "Leaving a mobile line live",
      "No confirmation email",
      "A 'pause' that is not disconnect"
    ],
    path: "Chat or 1-833-267-6094. Disconnect, not pause. Return the gear.",
    phone: "1-833-267-6094",
    url: "https://www.spectrum.net",
    steps: [
      { title: "List every product", body: "Internet, TV, mobile, landline, security. Each can survive the others." },
      { title: "Ask for disconnect", body: "Not vacation. Not pause. Disconnect. Confirmation number + email." },
      { title: "Return the kit", body: "Store or prepaid label. Keep the receipt. A missing STB is a charge on a 'cancelled' account." },
      { title: "Read the last bill", body: "Prorate, ETF if any, equipment. Dispute extras with the confirmation in hand." }
    ],
    scriptTitle: "Disconnect",
    script: [
      { who: "you", text: "I need to disconnect all Spectrum services on this account, including mobile if any. I do not want a pause or a promo. Please give me a confirmation number and equipment return steps." },
      { who: "them", text: "I can lower the internet rate if you keep it." },
      { who: "you", text: "No. Process the disconnect and email the confirmation." }
    ],
    letter: {
      toLabel: "Spectrum / Charter",
      defaultTo: "Charter Communications, Attn: Disconnect, 400 Atlantic Street, Stamford, CT 06901",
      extraFields: [
        { key: "memberId", label: "Account number", placeholder: "Spectrum account #" }
      ],
      subject: "DISCONNECT REQUEST — {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease disconnect all services on Spectrum account {{memberId}} for {{fullName}} at {{address}}. I decline retention. Send confirmation and equipment-return instructions to {{phone}}.\n\n{{fullName}}\n"
    },
    cancelBy: { kind: "watch-window", hint: "Ask for the disconnect effective date. Return equipment before their deadline." },
    typical: 80
  },
  {
    id: "mcafee",
    name: "McAfee",
    aliases: ["mcafee total", "mcafee antivirus"],
    category: "Security",
    difficulty: "hard",
    blurb: "Trials convert. The cancel path is a phone tree. Uninstalling does nothing.",
    trap: "PC bloatware trials auto-renew at a much higher price. The site hides live cancel behind 'contact us'. Uninstall ≠ cancel.",
    fails: [
      "Uninstalling the app",
      "Deleting the renewal email",
      "Stopping the card without a confirmation",
      "Cancelling one SKU and leaving a second seat"
    ],
    path: "manage.mcafee.com if the button exists; otherwise the phone number on your receipt. Get a case ID.",
    url: "https://manage.mcafee.com",
    steps: [
      { title: "Sign in to Manage", body: "Look for subscription / auto-renew. If there is a real disable, screenshot it." },
      { title: "If there is no button, call", body: "The number on the renewal receipt, not a random SEO page. Ask for a case ID and email confirmation." },
      { title: "Turn off auto-renew first if they stall", body: "Then cancel. Two artifacts are better than one." },
      { title: "Watch the next two renewals", body: "These companies rebill. Keep the case ID for the bank." }
    ],
    scriptTitle: "Phone",
    script: [
      { who: "you", text: "I need to cancel all McAfee subscriptions and turn off auto-renew on this account. Please give me a case ID and email confirmation. I do not want a different product." },
      { who: "them", text: "I can discount the renewal 50%." },
      { who: "you", text: "No. Cancel and email the confirmation." }
    ],
    letter: {
      toLabel: "McAfee (written backup)",
      defaultTo: "McAfee, LLC, 6220 America Center Drive, San Jose, CA 95002",
      extraFields: [
        { key: "memberId", label: "Account / email", placeholder: "McAfee account email" }
      ],
      subject: "CANCEL AND DISABLE AUTO-RENEW — {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease cancel all McAfee subscriptions for {{fullName}} ({{memberId}}) and disable auto-renew immediately. Send written confirmation to {{address}}, {{phone}}.\n\n{{fullName}}\n"
    },
    cancelBy: { kind: "notice-days", noticeDays: 7, hint: "Trials convert fast. Kill auto-renew as soon as you see the charge." },
    typical: 12
  },
  {
    id: "peloton",
    name: "Peloton",
    aliases: ["peloton app", "peloton membership"],
    category: "Health",
    difficulty: "mid",
    blurb: "Hardware membership and the App are different desks. Pause is not cancel.",
    trap: "The bike membership and the phone app are billed separately. Gifted trials convert. 'Pause' keeps the relationship warm and the card on file.",
    fails: [
      "Unplugging the bike",
      "Deleting the app",
      "Cancelling App and leaving All-Access",
      "Pause that auto-resumes"
    ],
    path: "membership.onepeloton.com — All-Access vs App. Screenshot the end date.",
    url: "https://membership.onepeloton.com",
    steps: [
      { title: "Identify the product", body: "All-Access (hardware) vs Peloton App. You may have both." },
      { title: "Cancel in the membership portal", body: "Not the workout screen. End membership, not pause, unless you truly want a pause end date." },
      { title: "If billed through Apple or Google", body: "The store is the desk. Subscriptions in iOS Settings or Google Play." },
      { title: "Watch one more draft", body: "Period already paid usually runs out. Confirm no next cycle." }
    ],
    scriptTitle: "Chat / email if the portal loops",
    script: [
      { who: "you", text: "Please cancel my Peloton All-Access / App membership on this account. I do not want a pause. Email the end date." },
      { who: "them", text: "You can pause for 3 months." },
      { who: "you", text: "No pause. Cancel, and send confirmation." }
    ],
    letter: {
      toLabel: "Peloton (backup)",
      defaultTo: "Peloton Interactive, Inc., 441 Ninth Avenue, New York, NY 10001",
      extraFields: [
        { key: "memberId", label: "Account email", placeholder: "Peloton email" }
      ],
      subject: "MEMBERSHIP CANCELLATION — {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease cancel all Peloton memberships for {{fullName}} ({{memberId}}), including All-Access and App if both exist. I decline pause. Confirm the last bill date in writing.\n\n{{fullName}}\n{{phone}}\n{{address}}\n"
    },
    cancelBy: { kind: "watch-window", hint: "Cancel any day; paid time usually runs out. Confirm the end date in the portal." },
    typical: 44
  },
  {
    id: "hellofresh",
    name: "HelloFresh",
    aliases: ["hello fresh"],
    category: "Food",
    difficulty: "mid",
    blurb: "Skip is not cancel. Cutoff days are the trap. One more box is the business model.",
    trap: "Skipping a week feels like cancel. It is not. The cutoff for the next box is earlier than you think. Annual 'head of household' promos rebill.",
    fails: [
      "Skipping forever",
      "Missing the weekly cutoff",
      "Cancelling the app and leaving the web plan",
      "A pause that expires"
    ],
    path: "Account → Subscription → Cancel. Do it before the weekly cutoff.",
    url: "https://www.hellofresh.com",
    steps: [
      { title: "Open the real subscription page", body: "Not the skip calendar. Look for Cancel subscription / Manage plan." },
      { title: "Beat the cutoff", body: "If a box is already 'finalized', you own that box. Cancel still stops the ones after." },
      { title: "Confirm zero upcoming", body: "No deliveries scheduled. Screenshot." },
      { title: "Watch the card", body: "One more charge is common when cutoff was missed. That is a box, not a ghost membership — unless a second charge lands." }
    ],
    scriptTitle: "Chat if the button is missing",
    script: [
      { who: "you", text: "Please cancel my HelloFresh subscription entirely — not a skip, not a pause. Confirm there are no upcoming boxes after this cycle." },
      { who: "them", text: "I can give you boxes at $4.99/meal if you stay." },
      { who: "you", text: "No. Cancel the plan and email confirmation." }
    ],
    letter: {
      toLabel: "HelloFresh (rarely needed)",
      defaultTo: "HelloFresh, 28 Liberty Street, New York, NY 10005",
      extraFields: [
        { key: "memberId", label: "Account email", placeholder: "HelloFresh email" }
      ],
      subject: "CANCEL SUBSCRIPTION — {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease cancel the HelloFresh subscription for {{fullName}} ({{memberId}}) entirely. No skips or pauses. Confirm no further charges after any already-finalized box.\n\n{{fullName}}\n"
    },
    cancelBy: { kind: "watch-window", hint: "Cancel before the weekly cutoff shown in your account. Skip is not cancel." },
    typical: 80
  },
  {
    id: "nytimes",
    name: "The New York Times",
    aliases: ["nyt", "new york times", "ny times"],
    category: "News",
    difficulty: "mid",
    blurb: "Intro rate expires. Cooking / Games / Athletic can keep billing after you 'cancelled the Times'.",
    trap: "The bundle is several products. Cancelling 'news' can leave Cooking, Games, or The Athletic. Intro $1/mo becomes the rack rate and people think they were scammed — it was in the checkout.",
    fails: [
      "Cancelling news only",
      "Deleting the app",
      "Pause as cancel",
      "A family sharing seat you do not own"
    ],
    path: "nytimes.com/account → Subscriptions. Cancel each product. Screenshot.",
    url: "https://www.nytimes.com/account",
    steps: [
      { title: "List every Times product", body: "News, Cooking, Games, Athletic, Wirecutter bundle pieces. Each has a cancel." },
      { title: "Cancel in account, not chat first", body: "There is a real path. Use it. Chat if a product is missing from the list." },
      { title: "Ignore pause", body: "Pause keeps the card on file. If you want out, cancel." },
      { title: "Save the emails", body: "One per product. If a draft continues, you know which SKU survived." }
    ],
    scriptTitle: "Chat — leftover product",
    script: [
      { who: "you", text: "Please cancel every New York Times subscription on this account, including Cooking, Games, and The Athletic if present. I want no remaining Times charges." },
      { who: "them", text: "I can pause news for 3 months." },
      { who: "you", text: "Do not pause. Cancel all of them and email confirmation for each." }
    ],
    letter: {
      toLabel: "NYT (backup)",
      defaultTo: "The New York Times Company, 620 Eighth Avenue, New York, NY 10018",
      extraFields: [
        { key: "memberId", label: "Account email", placeholder: "NYT email" }
      ],
      subject: "CANCEL ALL SUBSCRIPTIONS — {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease cancel all New York Times Company subscriptions for {{fullName}} ({{memberId}}), including news, Cooking, Games, and The Athletic. Send confirmation to {{address}}.\n\n{{fullName}}\n{{phone}}\n"
    },
    cancelBy: { kind: "watch-window", hint: "Cancel any day. Watch for leftover products on the next statement." },
    typical: 17
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime",
    aliases: ["prime", "amazon"],
    category: "Retail",
    difficulty: "mid",
    blurb: "Prime is the easy button. Channels, Subscribe & Save, and Kindle are not Prime.",
    trap: "People cancel Prime and still pay for Max, sports channels, Subscribe & Save, Audible, and a second household Prime. The maze is the cousins.",
    fails: [
      "Cancelling Prime and leaving Channels",
      "A household adult still paying",
      "Audible as a 'Prime perk'",
      "Subscribe & Save as Prime"
    ],
    path: "amazon.com → Account → Prime → Update, cancel, or change. Then hunt Channels and other memberships.",
    url: "https://www.amazon.com/gp/primecentral",
    steps: [
      { title: "Cancel Prime itself", body: "Prime Central. End membership. Note whether you get a remainder refund — depends on usage and their current policy." },
      { title: "Open Your Memberships", body: "Channels, Subscribe & Save, Kindle Unlimited, Audible, Medical, Grocery. Cancel the ones you do not want." },
      { title: "Household", body: "Amazon Household can keep benefits and billing on someone else's card. Check who pays." },
      { title: "Watch the next statement", body: "Prime disappearing is not the same as a $0 Amazon membership line." }
    ],
    scriptTitle: "Chat if Prime Central loops",
    script: [
      { who: "you", text: "Please cancel Amazon Prime on this account and list every other paid membership still active so I can cancel those too." },
      { who: "them", text: "You will lose faster shipping. I can give a month free." },
      { who: "you", text: "Still cancel Prime. Then list remaining memberships." }
    ],
    letter: {
      toLabel: "Amazon (rarely needed)",
      defaultTo: "Amazon.com, Attn: Prime Cancellations, P.O. Box 81226, Seattle, WA 98108",
      extraFields: [
        { key: "memberId", label: "Account email", placeholder: "Amazon email" }
      ],
      subject: "PRIME CANCELLATION — {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease cancel Amazon Prime for {{fullName}} ({{memberId}}) and confirm in writing. I will cancel Channels and other memberships separately if they remain.\n\n{{fullName}}\n"
    },
    cancelBy: { kind: "watch-window", hint: "Cancel any day. Hunt cousin memberships the same afternoon." },
    typical: 15
  },
  {
    id: "ancestry",
    name: "Ancestry",
    aliases: ["ancestry.com", "ancestry dna"],
    category: "Identity",
    difficulty: "mid",
    blurb: "DNA kit ≠ subscription. World Explorer auto-renews. Records access dies; your tree usually does not.",
    trap: "A DNA kit upsells a recurring records plan. People think they paid once. They did not.",
    fails: [
      "Thinking the kit was the only charge",
      "Cancelling the wrong regional site",
      "Leaving Folders / extra seats",
      "No confirmation email"
    ],
    path: "Account Settings → Account details → Cancel membership. Do it on the same regional site that bills you.",
    url: "https://www.ancestry.com/account",
    steps: [
      { title: "Sign in on the site that bills you", body: "ancestry.com vs ancestry.co.uk etc. Wrong desk cannot cancel." },
      { title: "Cancel membership, not just DNA", body: "DNA results stay. The records plan is the draft." },
      { title: "Screenshot the end date", body: "Access usually runs to the end of the prepaid term." },
      { title: "Watch one more cycle", body: "Annual plans rebill quietly. Keep the email." }
    ],
    scriptTitle: "Chat",
    script: [
      { who: "you", text: "Please cancel my Ancestry subscription. I am keeping DNA results. I do not want a different records plan." },
      { who: "them", text: "I can give you 50% off six months." },
      { who: "you", text: "No. Cancel and email the end date." }
    ],
    letter: {
      toLabel: "Ancestry",
      defaultTo: "Ancestry.com, 1300 W. Traverse Parkway, Lehi, UT 84043",
      extraFields: [
        { key: "memberId", label: "Account email", placeholder: "Ancestry email" }
      ],
      subject: "MEMBERSHIP CANCELLATION — {{memberId}}",
      body: "{{today}}\n\n{{to}}\n\nPlease cancel all Ancestry subscriptions for {{fullName}} ({{memberId}}). DNA results should remain. Confirm the last bill date in writing.\n\n{{fullName}}\n{{phone}}\n"
    },
    cancelBy: { kind: "watch-window", hint: "Cancel before the annual rebill date shown in account details." },
    typical: 25
  },
  {
    id: "lifetime",
    name: "Life Time",
    aliases: ["lifetime fitness", "life time fitness"],
    category: "Gym",
    difficulty: "hard",
    blurb: "Premium club, premium notice. Written notice, often 30 days, to the home club.",
    trap: "Initiation fees, annual, and a notice window. Front desk will offer a freeze or a cheaper club. Those are new contracts.",
    fails: [
      "Email without proof of receipt",
      "Freeze that resumes",
      "Cancelling add-ons but not the base",
      "Moving cities and assuming it died"
    ],
    path: "Written notice to the home club per the agreement. Signed copy.",
    steps: [
      { title: "Read notice + annual month", body: "Start 30 days before you want out, earlier if an annual is coming." },
      { title: "Deliver the form they require", body: "In person or certified mail. Photo of the stamped copy." },
      { title: "Decline rewrite", body: "A new agreement resets the clock. If you want out, do not sign." },
      { title: "Watch two drafts", body: "Notice periods mean one more bill is often legal. Two more is a fight." }
    ],
    scriptTitle: "Member services",
    script: [
      { who: "you", text: "I am cancelling. Please give me the cancellation form my agreement requires and a dated copy. I am not freezing or transferring." },
      { who: "them", text: "We can move you to a lower tier." },
      { who: "you", text: "No new agreement. Cancel per the existing one." }
    ],
    letter: {
      toLabel: "Home club",
      defaultTo: "[Life Time home club street address]",
      extraFields: [
        { key: "club", label: "Home club", placeholder: "Life Time …" },
        { key: "memberId", label: "Member ID", placeholder: "Member ID" }
      ],
      subject: "MEMBERSHIP CANCELLATION — {{fullName}}",
      body: "{{today}}\n\nLife Time, {{club}}\n{{to}}\n\nPlease cancel membership {{memberId}} for {{fullName}} per the written-notice terms of my agreement. I decline freeze or rewrite. Stop all EFTs including annual fees after the notice period. Confirm in writing to {{address}}, {{phone}}.\n\nSignature: ____________________\n{{fullName}}\n"
    },
    cancelBy: { kind: "notice-days", noticeDays: 30, hint: "Assume 30 days written notice unless your agreement says otherwise." },
    typical: 170
  }
];
