/* interview-app.js
   Question bank + rule-based feedback engine + UI logic for interview.html.
   Career keys match CAREER_KEYS in discover.html / script.js so they stay
   consistent across the site. No AI calls — feedback is generated from
   keyword coverage, answer length, and basic grammar checks. */

const CAREERS = {

cyber: { name: "Cybersecurity Analyst", questions: [
  { type:"behavioral", text:"Tell me about a time you identified a security risk or vulnerability that others had missed.",
    keywords:["identif","investigat","risk","impact","reported","escalat","remediat","prevent"], minWords:60, maxWords:200,
    example:"While reviewing access logs during a routine audit, I noticed a service account had permissions far beyond what its function required. I investigated further and found it had been over-provisioned during a rushed migration months earlier. I documented the exposure, assessed the potential impact if the credentials were compromised, and escalated it to my manager with a remediation plan. We tightened the permissions that week and used the finding to justify a broader least-privilege review across other service accounts." },
  { type:"behavioral", text:"Describe how you'd handle disagreeing with a colleague or manager about how severe an incident is.",
    keywords:["evidence","data","framework","listen","escalat","document","communicat","respect"], minWords:60, maxWords:200,
    example:"I'd start by making sure I understood their reasoning, since severity calls are often about risk tolerance, not just facts. Then I'd walk through the evidence and reference our severity framework or CVSS scoring to ground the conversation in something objective rather than opinion. If we still disagreed after that, I'd document both perspectives and escalate to whoever owns the final call, rather than letting it stall response time. Staying calm and evidence-driven keeps the focus on the incident instead of the disagreement." },
  { type:"behavioral", text:"How do you stay current with new threats and vulnerabilities?",
    keywords:["cve","feed","advisor","community","training","certif","read","practice"], minWords:40, maxWords:150,
    example:"I follow CVE and vendor security advisories relevant to the systems we run, and I subscribe to a few trusted threat intelligence feeds and newsletters. I'm also active in a couple of security communities where practitioners share real incident write-ups, which is often more useful than generic news. Beyond reading, I try to get hands-on practice through labs or CTF-style exercises so new attack techniques aren't just theoretical to me." },
  { type:"technical", text:"Walk me through how you'd triage a phishing report an employee just sent you.",
    keywords:["header","sender","link","attachment","sandbox","scope","contain","block","notify"], minWords:60, maxWords:200,
    example:"First I'd confirm it's actually phishing by checking the sender address, headers, and any links or attachments, ideally in a sandboxed environment rather than clicking directly. If it's malicious, I'd determine scope: who else received it, and whether anyone clicked or entered credentials. I'd block the sender/domain and any malicious URLs at the email gateway or firewall, reset credentials for anyone who interacted with it, and notify affected users. Finally I'd document the incident and, if it's a pattern, feed it into user awareness training." },
  { type:"technical", text:"What's the difference between a vulnerability, a threat, and a risk?",
    keywords:["vulnerability","weakness","threat","actor","risk","likelihood","impact"], minWords:40, maxWords:150,
    example:"A vulnerability is a weakness in a system, like unpatched software or a misconfiguration. A threat is something that could exploit that weakness, such as an attacker or malware. Risk is the combination of the two: the likelihood a threat will exploit a vulnerability, multiplied by the potential impact if it does. So you can have a vulnerability with no real threat targeting it, which means lower risk, versus a vulnerability actively being exploited in the wild, which is high risk." },
  { type:"technical", text:"Explain the difference between a firewall and an IDS/IPS.",
    keywords:["firewall","traffic","rule","block","ids","ips","detect","prevent","signature"], minWords:40, maxWords:150,
    example:"A firewall controls traffic based on rules, like allowed ports, IP addresses, or protocols, and decides what gets in or out. An IDS, intrusion detection system, monitors traffic for suspicious patterns or known attack signatures and alerts on them, but doesn't block anything itself. An IPS, intrusion prevention system, does the same detection but can actively block or drop the malicious traffic in real time. In practice they're often layered together: firewall for access control, IDS/IPS for spotting and stopping attacks that get past it." },
  { type:"technical", text:"What SIEM tools have you used or studied, and how would you write a query to find repeated failed logins?",
    keywords:["siem","splunk","sentinel","elastic","query","failed","login","threshold","correlat"], minWords:40, maxWords:200,
    example:"I've worked with Splunk and studied Microsoft Sentinel's query language. To find repeated failed logins, I'd search the authentication logs for event codes indicating a failed attempt, filter by a time window, then group by username or source IP and count occurrences, flagging anything above a threshold like five failures in ten minutes. In Splunk that would look something like a stats count by user, src_ip over the failed-login events, sorted descending so the highest counts surface first for investigation." }
]},

developer: { name: "Software/App Developer", questions: [
  { type:"behavioral", text:"Tell me about a challenging bug you fixed. What was your process?",
    keywords:["reproduc","debug","log","isolat","root cause","test","fix","verify"], minWords:60, maxWords:200,
    example:"I once had an intermittent crash that only happened in production, never locally. I started by reproducing it consistently, which took adding more detailed logging around the suspected area. Once I could trigger it reliably, I isolated the issue to a race condition where two threads were writing to the same cache without locking. I fixed it with a proper lock around the critical section, wrote a test that simulated concurrent access to catch regressions, and verified the fix held under load before deploying." },
  { type:"behavioral", text:"Describe a time you had to learn a new language or framework quickly.",
    keywords:["learn","documentation","practice","build","ask","mentor","deadline","apply"], minWords:50, maxWords:200,
    example:"When I joined a project using a framework I hadn't touched before, I gave myself a short ramp-up period: I read the official documentation, then built a small throwaway feature to get hands-on practice rather than just reading theory. When I hit gaps, I asked a teammate who knew it well instead of getting stuck for hours. Within about a week I was contributing real code, and I kept learning by reading through existing parts of the codebase to see established patterns." },
  { type:"behavioral", text:"How do you handle receiving critical feedback on your code in a review?",
    keywords:["listen","understand","defensive","learn","discuss","improve","open"], minWords:40, maxWords:150,
    example:"I try to separate the feedback from my ego and focus on whether it makes the code better. If I don't understand the reasoning behind a comment, I'll ask for clarification rather than assuming it's a criticism of me. If I disagree, I'll explain my reasoning and we discuss it, but I stay open to being wrong. Overall I see code review as one of the fastest ways to improve, so I try to treat critical feedback as useful rather than something to get defensive about." },
  { type:"technical", text:"Explain the difference between a stack and a queue, and give a real use case for each.",
    keywords:["stack","lifo","queue","fifo","push","pop","enqueue","dequeue"], minWords:40, maxWords:150,
    example:"A stack is LIFO, last in first out, like a stack of plates: you add and remove from the top. It's used for things like the undo feature in an editor or tracking function calls. A queue is FIFO, first in first out, like a line at a store: whoever gets in first gets served first. It's used for things like task scheduling or handling requests in the order they arrive, such as a print queue or a message processing system." },
  { type:"technical", text:"Print numbers 1 to 100, but for multiples of 3 print \"Fizz\", multiples of 5 print \"Buzz\", and multiples of both print \"FizzBuzz.\"",
    keywords:["loop","modulo","condition","fizz","buzz","both","else"], minWords:30, maxWords:200,
    example:"I'd loop from 1 to 100, and for each number check the modulo conditions in the right order: first check if it's divisible by both 3 and 5 and print FizzBuzz, then check divisible by 3 alone for Fizz, then by 5 alone for Buzz, and otherwise print the number itself. The key detail is checking the 'divisible by both' case first, since 15 is divisible by both 3 and 5 and needs to print FizzBuzz rather than getting caught by the Fizz check alone." },
  { type:"technical", text:"What's the difference between SQL and NoSQL databases, and when would you choose one over the other?",
    keywords:["sql","relational","schema","nosql","document","scale","consistency","flexible"], minWords:50, maxWords:200,
    example:"SQL databases are relational, with a fixed schema and structured tables connected through relationships, which makes them strong for data integrity and complex queries. NoSQL databases, like document or key-value stores, are more flexible with schema and tend to scale horizontally more easily, which suits unstructured or rapidly changing data. I'd choose SQL when I need strong consistency and relationships between entities, like financial records, and NoSQL when I need flexibility and scale, like storing varied user-generated content." },
  { type:"technical", text:"Explain what Git is and walk me through your typical branching workflow.",
    keywords:["git","version control","branch","commit","merge","pull request","main"], minWords:40, maxWords:200,
    example:"Git is a version control system that tracks changes to code over time and lets multiple people work on the same project without overwriting each other's work. My typical workflow is to branch off main for each feature or fix, commit changes incrementally with clear messages, and push the branch for review. Once a pull request is approved and tests pass, I merge it into main, then delete the feature branch to keep things clean." }
]},

cloud: { name: "Cloud Infrastructure", questions: [
  { type:"behavioral", text:"Tell me about a time you had to troubleshoot a performance issue or outage under pressure.",
    keywords:["monitor","metric","root cause","isolat","communicat","resolve","postmortem"], minWords:60, maxWords:200,
    example:"During a traffic spike, one of our services started returning errors under load. I checked our monitoring dashboards first to isolate whether it was compute, database, or network, and found the database connection pool was maxed out. I temporarily scaled up the pool size and added connection limits to stop the bleeding, communicated status updates to the team every fifteen minutes, and once stable, wrote a postmortem identifying the missing autoscaling rule that let us catch it earlier next time." },
  { type:"behavioral", text:"Describe a time you automated a manual or repetitive task.",
    keywords:["automat","script","repetitive","time","reliab","reduce","tool"], minWords:50, maxWords:200,
    example:"Our team was manually provisioning new environments by clicking through the cloud console, which took about an hour each time and was error-prone. I wrote a script using infrastructure-as-code to automate the whole process, turning it into a single command that ran in a few minutes. Beyond saving time, it made environments consistent since human error from manual clicking was eliminated, and it made it easy for anyone on the team to spin up an environment without needing deep platform knowledge." },
  { type:"behavioral", text:"How do you approach learning a cloud service you've never used before?",
    keywords:["documentation","sandbox","experiment","small","practice","read","apply"], minWords:40, maxWords:150,
    example:"I start with the official documentation to understand what problem the service actually solves, then spin up a small sandbox environment to experiment hands-on rather than just reading theory. I'll build something small end-to-end, break it on purpose to see how it fails, and look at pricing and limits early so I understand tradeoffs. That combination of reading and hands-on practice gets me comfortable enough to use it in a real project fairly quickly." },
  { type:"technical", text:"Explain the difference between IaaS, PaaS, and SaaS, with an example of each.",
    keywords:["iaas","infrastructure","paas","platform","saas","software","manage"], minWords:40, maxWords:200,
    example:"IaaS gives you raw infrastructure like virtual machines and networking that you manage yourself, such as EC2. PaaS provides a managed platform to run your code without managing the underlying servers, such as Heroku or Elastic Beanstalk. SaaS is a complete software product you use directly with no infrastructure management at all, such as Gmail or Salesforce. Moving from IaaS to SaaS, you get more convenience but less control over the underlying stack." },
  { type:"technical", text:"What is Infrastructure as Code, and why does it matter? Name a tool.",
    keywords:["infrastructure as code","declarative","version control","reproducib","terraform","cloudformation"], minWords:40, maxWords:150,
    example:"Infrastructure as Code means defining and provisioning your infrastructure through configuration files instead of manual setup, so it can be version-controlled, reviewed, and reproduced reliably. It matters because it eliminates configuration drift, makes environments consistent across dev and production, and lets you track infrastructure changes the same way you track code changes. Terraform is a common tool for this, letting you declare the desired state of your infrastructure and it figures out how to get there." },
  { type:"technical", text:"What happens if two engineers run terraform apply at the same time, and how do you prevent problems?",
    keywords:["state","lock","conflict","remote","backend","race"], minWords:40, maxWords:200,
    example:"If two people run terraform apply at the same time without protection, they can both read the same state file, make conflicting changes, and corrupt the state or create duplicate resources. To prevent that, you use a remote backend with state locking, like an S3 bucket with a DynamoDB lock table, so only one apply can run at a time while the state is locked. Anyone else trying to apply simultaneously gets blocked until the lock is released." },
  { type:"technical", text:"Explain the shared responsibility model in cloud security.",
    keywords:["shared responsibility","provider","customer","physical","configur","data","access"], minWords:40, maxWords:150,
    example:"The shared responsibility model splits security duties between the cloud provider and the customer. The provider is responsible for security 'of' the cloud, meaning physical data centers, hardware, and the underlying infrastructure. The customer is responsible for security 'in' the cloud, meaning how they configure access controls, encrypt data, patch their own applications, and manage identity permissions. A misconfigured storage bucket left public, for example, is the customer's responsibility, not the provider's." }
]},

dba: { name: "Database Administrator", questions: [
  { type:"behavioral", text:"Tell me about a time a database issue caused downtime or risk, and how you resolved it.",
    keywords:["diagnos","root cause","rollback","backup","communicat","resolve","prevent"], minWords:60, maxWords:200,
    example:"A migration script locked a heavily used table longer than expected, causing timeouts across the application. I diagnosed it quickly by checking active queries and lock waits, killed the offending transaction, and rolled back to restore service within minutes. Afterward I worked with the team to rewrite the migration to run in smaller batches with shorter lock durations, and we added a policy of testing migrations against a production-sized dataset before running them live." },
  { type:"behavioral", text:"Describe how you'd prioritize competing requests from multiple teams needing database changes.",
    keywords:["priorit","impact","risk","communicat","schedule","stakeholder"], minWords:40, maxWords:150,
    example:"I'd evaluate each request by impact and urgency, considering things like whether it's blocking a release, affecting production stability, or just a nice-to-have optimization. I'd communicate clearly with each team about where their request stands and roughly when I can get to it, rather than leaving them guessing. For lower-risk changes I might batch several together in a maintenance window, while urgent fixes get handled immediately." },
  { type:"technical", text:"What is normalization, and why does it matter? Briefly describe what 1NF through 3NF accomplish.",
    keywords:["normaliz","redundan","1nf","2nf","3nf","atomic","dependency","integrity"], minWords:50, maxWords:200,
    example:"Normalization organizes data to reduce redundancy and improve data integrity. First normal form requires atomic values, meaning no repeating groups or multiple values in a single column. Second normal form removes partial dependencies, ensuring non-key columns depend on the whole primary key, not just part of it. Third normal form removes transitive dependencies, so non-key columns depend only on the primary key, not on other non-key columns. Together these reduce duplicate data and make updates more consistent." },
  { type:"technical", text:"What's the difference between DELETE, TRUNCATE, and DROP?",
    keywords:["delete","truncate","drop","rollback","row","table","structure"], minWords:30, maxWords:150,
    example:"DELETE removes specific rows based on a condition, is logged row by row, and can be rolled back within a transaction. TRUNCATE removes all rows from a table at once, is faster since it's minimally logged, but generally can't be selectively filtered. DROP removes the entire table structure itself, not just the data, so the table no longer exists afterward. In short: DELETE is selective and reversible, TRUNCATE clears everything fast, and DROP eliminates the table entirely." },
  { type:"technical", text:"Explain the difference between a full, differential, and transaction log backup.",
    keywords:["full backup","differential","transaction log","restore","point-in-time","incremental"], minWords:40, maxWords:200,
    example:"A full backup captures the entire database at a point in time and is the baseline for any restore. A differential backup captures only the changes made since the last full backup, making it faster and smaller than repeating a full backup. A transaction log backup captures every transaction since the last log backup, which allows point-in-time recovery, restoring to a specific moment rather than just the last backup taken. Together they let you restore quickly while minimizing data loss." },
  { type:"technical", text:"What is database indexing, and what's the tradeoff of adding more indexes?",
    keywords:["index","lookup","query","speed","write","insert","update","tradeoff","storage"], minWords:40, maxWords:150,
    example:"An index is a data structure that speeds up lookups on a table, similar to an index in a book, so the database doesn't have to scan every row to find matching data. The tradeoff is that every index has to be updated whenever you insert, update, or delete rows, which slows down write operations and uses additional storage. So indexes should be added deliberately on columns that are frequently searched or joined, not on every column." }
]},

netadmin: { name: "Network Administrator", questions: [
  { type:"behavioral", text:"Walk me through how you'd approach a user reporting \"the internet is down.\"",
    keywords:["scope","isolat","ping","dns","reproduc","escalat","resolve"], minWords:50, maxWords:200,
    example:"I'd start by narrowing the scope: is it just this user, their whole floor, or the entire office. I'd ask them to check basic things like whether the cable or Wi-Fi is connected, then test connectivity myself, checking whether it's a DNS issue versus a full connectivity loss by pinging an IP address directly versus a domain name. From there I'd isolate whether the problem is local to their machine, the switch or access point, or further upstream, and escalate if it's beyond what I can fix at their desk." },
  { type:"behavioral", text:"Tell me about a time you had to explain a technical network issue to a non-technical person.",
    keywords:["simple","analog","jargon","clear","understand","patient"], minWords:40, maxWords:150,
    example:"When explaining a bandwidth congestion issue to a department head, I avoided jargon like packet loss and latency and instead compared it to a highway getting congested during rush hour, where too much traffic slows everyone down. That let them understand why their video calls were choppy without needing technical background, and made it easier for them to understand why we needed budget approval for additional bandwidth." },
  { type:"technical", text:"Explain the OSI model and which layers you'd check first when troubleshooting connectivity.",
    keywords:["osi","layer","physical","network","transport","application","troubleshoot"], minWords:50, maxWords:200,
    example:"The OSI model has seven layers: physical, data link, network, transport, session, presentation, and application, going from raw cabling up to the actual software. When troubleshooting connectivity, I typically start at the bottom: check the physical layer first, is the cable plugged in and the light on, then move up to whether the device has a valid IP address at the network layer, then check whether the actual service or application is responding. Working bottom-up avoids wasting time debugging an application when the real issue is a loose cable." },
  { type:"technical", text:"What is subnetting, and why do we use it?",
    keywords:["subnet","subnetting","network","broadcast","efficient","segment","security"], minWords:40, maxWords:150,
    example:"Subnetting divides a larger network into smaller, more manageable segments. We use it to reduce broadcast traffic, since broadcasts stay within a subnet rather than flooding the whole network, and to organize devices logically, like separating departments or device types. It also improves security by letting you control traffic between subnets with firewall rules, and makes IP address allocation more efficient by right-sizing each segment instead of using one huge flat network." },
  { type:"technical", text:"What's the difference between TCP and UDP?",
    keywords:["tcp","reliable","connection","udp","connectionless","speed","acknowledg"], minWords:30, maxWords:150,
    example:"TCP is connection-oriented and reliable: it establishes a connection, guarantees delivery, and puts packets back in order, which makes it right for things like web browsing or file transfers where accuracy matters. UDP is connectionless and doesn't guarantee delivery or order, but it's faster with less overhead, which makes it suited for things like video streaming or online gaming where speed matters more than occasionally dropping a packet." },
  { type:"technical", text:"What is DNS, and what happens when you type a URL into a browser?",
    keywords:["dns","resolve","domain","ip address","server","cache","http","tcp"], minWords:50, maxWords:200,
    example:"DNS translates human-readable domain names into IP addresses that computers use to route traffic. When you type a URL, the browser first checks its cache for the IP address, and if it's not cached, it queries a DNS resolver, which may check several servers before returning the IP. Once the browser has the IP, it establishes a TCP connection to the server, often followed by a TLS handshake for HTTPS, and then sends an HTTP request to retrieve the page." }
]},

qa: { name: "Quality Assurance / Testing Technician", questions: [
  { type:"behavioral", text:"Tell me about a time your attention to detail caught a bug others missed.",
    keywords:["notice","edge case","test","detail","report","reproduc"], minWords:50, maxWords:200,
    example:"While testing a checkout flow, I noticed that entering a discount code with trailing whitespace caused the total to calculate incorrectly, something that had passed earlier review because testers had only used clean input. I reproduced it consistently, documented the exact steps and expected versus actual behavior, and flagged it before release. It turned out to be an input-trimming bug that would have affected a meaningful share of users who copy-pasted codes from emails." },
  { type:"behavioral", text:"Describe how you'd handle disagreeing with a developer about whether something is a bug.",
    keywords:["evidence","reproduc","expected","requirement","discuss","respect","document"], minWords:50, maxWords:200,
    example:"I'd make sure I could reproduce the behavior consistently and compare it against the documented requirements or acceptance criteria, since 'is this a bug' often comes down to what was actually expected. I'd present that evidence calmly rather than framing it as a disagreement about opinions. If we still saw it differently, I'd loop in the product owner to clarify the intended behavior, since that's ultimately their call, and document the resolution either way." },
  { type:"behavioral", text:"How do you prioritize what to test when you don't have time to test everything?",
    keywords:["risk","critical","priorit","impact","high-traffic","regression"], minWords:40, maxWords:150,
    example:"I prioritize based on risk and impact: core user flows like login or checkout get tested first since they affect the most users and cause the most damage if broken. I also weigh what changed recently, since new or heavily modified code is more likely to have issues than stable, untouched code. Lower-risk, rarely used features get tested last if time runs out, and I communicate clearly what wasn't covered so the team can make an informed release decision." },
  { type:"technical", text:"What's the difference between a test case and a test scenario?",
    keywords:["test case","test scenario","step","expected result","high-level","specific"], minWords:30, maxWords:150,
    example:"A test scenario is a high-level description of what to test, like 'verify login works correctly.' A test case is the detailed, specific set of steps under that scenario, including exact inputs, actions, and expected results, like 'enter valid username and password, click login, expect redirect to dashboard.' One scenario usually breaks down into multiple concrete test cases covering different conditions." },
  { type:"technical", text:"Walk me through how you'd write test cases for a login form.",
    keywords:["valid","invalid","empty","boundary","password","case sensitiv","lockout"], minWords:50, maxWords:200,
    example:"I'd start with the happy path: valid username and password logs in successfully. Then negative cases: wrong password, nonexistent username, empty fields, and see whether error messages are clear and don't leak whether the username exists. I'd check boundary and format cases like maximum field length, special characters, and case sensitivity. I'd also test security-related behavior like account lockout after repeated failed attempts, and whether the password field masks input." },
  { type:"technical", text:"What's the difference between manual and automated testing, and when would you use each?",
    keywords:["manual","automat","repetitive","regression","exploratory","maintain","cost"], minWords:40, maxWords:200,
    example:"Manual testing is done by a person exploring the application, which is well suited to exploratory testing, usability, and areas that change frequently where automation would need constant maintenance. Automated testing runs scripted checks without a person, which is well suited to repetitive regression tests that run the same way every time, like confirming core flows still work after every code change. I'd automate stable, high-value repetitive checks and rely on manual testing for new features and exploratory edge cases." },
  { type:"technical", text:"Explain the bug life cycle.",
    keywords:["new","assigned","open","fixed","retest","closed","reopen","verified"], minWords:40, maxWords:200,
    example:"A bug starts as New when it's first reported, then gets triaged and Assigned to a developer. The developer moves it to In Progress or Open while working on it, then marks it Fixed once resolved. The tester then retests it; if the fix works, it moves to Verified and Closed, but if the issue persists, it gets Reopened and sent back to the developer. This cycle ensures every bug is tracked from discovery through confirmed resolution." }
]},

analyst: { name: "Data Analyst", questions: [
  { type:"behavioral", text:"Tell me about a project where you used data to solve a business problem.",
    keywords:["analy","insight","recommend","impact","stakeholder","data","decision"], minWords:60, maxWords:200,
    example:"Our marketing team wanted to know why signups had plateaued. I pulled and analyzed funnel data and found a significant drop-off at a specific step in the onboarding flow. I dug deeper and correlated it with a recent UI change, presented the finding with supporting visuals to the team, and recommended reverting that change. After they implemented the fix, signups recovered within two weeks, and it reinforced the value of tracking funnel metrics after every UI release." },
  { type:"behavioral", text:"Describe a time you found an error or inconsistency in a dataset. What did you do?",
    keywords:["validate","inconsist","investigat","source","correct","flag","clean"], minWords:50, maxWords:200,
    example:"While preparing a report, I noticed revenue numbers from two source systems didn't reconcile for the same period. I investigated by tracing both back to their raw sources and found one system was including refunded transactions that the other excluded. I flagged the discrepancy to the data owner before publishing anything, we agreed on the correct definition going forward, and I documented it so future reports wouldn't hit the same mismatch." },
  { type:"technical", text:"Write a SQL query to find the top 3 departments by average salary.",
    keywords:["select","group by","avg","order by","limit","department"], minWords:20, maxWords:150,
    example:"I'd write: SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC LIMIT 3. This groups all employees by department, calculates the average salary within each group, sorts departments from highest to lowest average, and limits the result to the top three." },
  { type:"technical", text:"Explain the difference between INNER JOIN and LEFT JOIN.",
    keywords:["inner join","left join","match","null","row"], minWords:30, maxWords:150,
    example:"An INNER JOIN returns only the rows that have matching values in both tables, so if a record in one table has no match in the other, it's excluded entirely. A LEFT JOIN returns all rows from the left table regardless of a match, and fills in NULLs for columns from the right table where there's no match. So LEFT JOIN is useful when you want to keep every record from your primary table even if related data is missing." },
  { type:"technical", text:"How would you handle missing data in a dataset?",
    keywords:["missing","impute","drop","context","pattern","bias","mean","median"], minWords:40, maxWords:200,
    example:"It depends on why the data is missing and how much of it there is. First I'd check whether it's missing randomly or follows a pattern, since that affects whether dropping it introduces bias. For small amounts of random missingness, I might drop those rows; for larger gaps, I might impute using the mean, median, or a more sophisticated model-based estimate, depending on the field. I'd also flag to stakeholders when missingness itself might be meaningful, like a survey question people skip because it's sensitive." },
  { type:"technical", text:"Explain the difference between correlation and causation.",
    keywords:["correlation","causation","confound","relationship","experiment","control"], minWords:40, maxWords:150,
    example:"Correlation means two variables move together, but that doesn't prove one causes the other. There could be a confounding variable driving both, or the relationship could be coincidental. Causation means one variable actually produces a change in the other, which usually requires controlled experiments or careful statistical methods to establish, not just observing that they're related. A classic example is ice cream sales and drowning rates both rising in summer, correlated but not causally linked; heat is the confounder." },
  { type:"technical", text:"Walk me through how you'd approach a stakeholder request to \"find out why sales dropped last quarter.\"",
    keywords:["clarify","scope","segment","hypothes","data","trend","present"], minWords:50, maxWords:200,
    example:"I'd first clarify what they mean by 'dropped,' compared to what baseline, and which product or region if relevant, since a vague request can lead to wasted analysis. Then I'd pull the relevant sales data and segment it by variables like product line, region, and channel to see where the drop is concentrated rather than assuming it's uniform. I'd form a few hypotheses, like seasonality, a pricing change, or a competitor's move, and test each against the data before presenting findings with clear visuals and a recommendation." }
]},

bizanalytics: { name: "Business Analytics", questions: [
  { type:"behavioral", text:"Tell me about a time you translated data into a recommendation for a non-technical stakeholder.",
    keywords:["simplif","visual","recommend","business","clear","context","action"], minWords:50, maxWords:200,
    example:"I analyzed customer churn data and found a specific segment was leaving at a much higher rate. Rather than presenting the raw statistical model, I built a simple chart showing churn by segment and translated the finding into plain business language: this group is leaving three times faster, likely due to a pricing tier mismatch. I paired it with a concrete recommendation, adjusting that tier's onboarding, which the team could act on immediately without needing to understand the underlying analysis." },
  { type:"behavioral", text:"Describe a time you had to make a decision or recommendation with incomplete data.",
    keywords:["assumption","uncertain","confidence","risk","transparent","recommend"], minWords:50, maxWords:200,
    example:"We needed to recommend a launch timeline but didn't have full historical data for a new market. I used the closest comparable market's data as a proxy, clearly stated my assumptions, and gave a recommendation with a stated confidence level rather than false precision. I flagged the specific risks if the assumption was wrong and suggested a checkpoint early in the launch to validate or adjust course, which the team appreciated since it was honest about the uncertainty." },
  { type:"technical", text:"Explain descriptive vs. inferential statistics.",
    keywords:["descriptive","summar","inferential","sample","population","generaliz"], minWords:40, maxWords:150,
    example:"Descriptive statistics summarize and describe the data you actually have, things like mean, median, and standard deviation of a dataset. Inferential statistics use a sample of data to make generalizations or predictions about a larger population, using tools like hypothesis testing and confidence intervals. So descriptive statistics tell you what happened in your data, while inferential statistics let you draw conclusions beyond just that data." },
  { type:"technical", text:"What's the difference between a Type I and Type II error?",
    keywords:["type i","false positive","type ii","false negative","null hypothesis","reject"], minWords:40, maxWords:150,
    example:"A Type I error is a false positive: rejecting a true null hypothesis, concluding there's an effect when there actually isn't one. A Type II error is a false negative: failing to reject a false null hypothesis, missing a real effect that's actually there. In a business context, a Type I error might mean launching a change because you thought it improved results when it didn't, while a Type II error might mean missing out on a genuinely better option because the test didn't detect it." },
  { type:"technical", text:"How would you decide which statistical test to use in a given situation?",
    keywords:["data type","distribution","sample size","categorical","continuous","assumption"], minWords:40, maxWords:200,
    example:"I'd start with the type of data, categorical versus continuous, and how many groups I'm comparing, since that narrows the options significantly. For comparing two group means with roughly normal data I might use a t-test, for comparing categorical proportions I'd consider a chi-square test, and for more than two groups I might look at ANOVA. I'd also check assumptions like sample size and distribution shape, and use a non-parametric alternative if those assumptions aren't met." },
  { type:"technical", text:"Explain what a confidence interval actually tells you.",
    keywords:["confidence interval","range","estimate","certainty","sample","repeated"], minWords:40, maxWords:150,
    example:"A confidence interval gives a range of plausible values for a population parameter, along with a stated confidence level, like 95%. It doesn't mean there's a 95% chance the true value falls in that specific range; it means if you repeated the sampling process many times, about 95% of the intervals you'd construct would contain the true value. Practically, a narrower interval means a more precise estimate, often from a larger sample." }
]},

erp: { name: "ERP/Systems Consultant", questions: [
  { type:"behavioral", text:"Tell me about a time you had to understand a business process deeply before recommending a change.",
    keywords:["shadow","interview","process","workflow","stakeholder","document","recommend"], minWords:50, maxWords:200,
    example:"Before recommending changes to an inventory workflow, I spent time shadowing the warehouse team to see how they actually worked, not just how the process was documented on paper. I found several manual workarounds that didn't show up in the official procedure, which explained delays that otherwise looked mysterious in the data. Once I understood the real workflow, I could recommend a change that addressed the actual bottleneck instead of a symptom." },
  { type:"behavioral", text:"Describe how you'd handle a client or user who resists adopting new ERP workflows.",
    keywords:["listen","concern","training","benefit","involve","patient","change management"], minWords:50, maxWords:200,
    example:"I'd first try to understand the source of the resistance, since it's often rooted in a real concern, like fear the new system will be slower or harder, rather than just stubbornness. I'd listen to their specific pain points, involve them early in testing so they feel ownership rather than having something imposed on them, and pair the rollout with hands-on training. Showing a concrete before-and-after of how the new workflow saves them time usually does more than simply telling them it's better." },
  { type:"technical", text:"What is an ERP system, and what are its core modules?",
    keywords:["erp","integrat","finance","inventory","hr","supply chain","module"], minWords:40, maxWords:200,
    example:"An ERP system is enterprise resource planning software that integrates core business processes, like finance, HR, inventory, procurement, and supply chain, into a single unified system so data flows between departments instead of living in separate silos. Core modules typically include finance and accounting, human resources, inventory and supply chain management, procurement, and sometimes CRM. The value is that a change in one module, like inventory, automatically reflects in related areas, like finance." },
  { type:"technical", text:"Walk me through the typical phases of an ERP implementation lifecycle.",
    keywords:["discovery","design","configur","test","training","go-live","support"], minWords:50, maxWords:200,
    example:"It typically starts with discovery and planning, understanding the client's current processes and requirements. Then comes design, mapping how the ERP will handle those processes, followed by configuration and any necessary customization. Testing comes next, including user acceptance testing with real client staff, then training to prepare users for the change. Go-live is the actual cutover to the new system, and finally post-go-live support to handle issues and stabilize the new workflows." },
  { type:"technical", text:"What's the difference between a functional consultant and a technical consultant?",
    keywords:["functional","business process","technical","code","customiz","integrat"], minWords:30, maxWords:150,
    example:"A functional consultant focuses on the business side: understanding processes, configuring the system to match business needs, and translating requirements into system settings. A technical consultant focuses on the underlying code, customizations, integrations with other systems, and things standard configuration can't achieve. In practice they work closely together, with the functional consultant defining what the business needs and the technical consultant building the more complex pieces that require custom development." },
  { type:"technical", text:"How would you approach gathering requirements before configuring a new ERP module?",
    keywords:["interview","stakeholder","current process","pain point","document","workshop"], minWords:50, maxWords:200,
    example:"I'd start by interviewing the actual users of the process, not just their managers, since they know the day-to-day reality best. I'd document the current-state process, identify pain points and inefficiencies, and run a workshop with stakeholders to align on the future-state process before touching configuration. I'd also make sure to capture edge cases and exceptions early, since those are often what break a configuration that looked fine for the standard case." }
]},

itba: { name: "IT Business Analyst", questions: [
  { type:"behavioral", text:"Tell me about a time you gathered requirements from stakeholders with conflicting priorities.",
    keywords:["conflict","priorit","align","facilitat","compromise","document","stakeholder"], minWords:50, maxWords:200,
    example:"Two departments wanted different features prioritized in the same release, each with valid business reasons. I set up a joint session where each side presented their case, which helped surface that part of the conflict was actually a misunderstanding about scope. I facilitated a discussion to find overlap, proposed a phased approach that addressed the most urgent need from each side first, and documented the agreed priorities so there was no ambiguity afterward." },
  { type:"behavioral", text:"Describe how you'd handle requirements changing midway through a project.",
    keywords:["change control","impact","communicat","scope","reassess","document"], minWords:50, maxWords:200,
    example:"I'd first assess the impact of the change on timeline, cost, and other requirements, rather than just accepting or rejecting it reactively. I'd document the change through a formal change request process so there's a clear record, and communicate the tradeoffs to stakeholders so they can make an informed decision about whether it's worth the impact. If approved, I'd update the requirements documentation and make sure the whole team is aligned on the new scope before continuing." },
  { type:"technical", text:"What's the difference between a BRD, an FRS, and an SRS?",
    keywords:["brd","business requirement","frs","functional","srs","software requirement"], minWords:40, maxWords:150,
    example:"A BRD, Business Requirements Document, captures high-level business needs and goals, the 'why' behind a project, aimed at stakeholders and sponsors. An FRS, Functional Requirements Specification, translates those business needs into specific functional behaviors the system must have, the 'what.' An SRS, Software Requirements Specification, goes further into technical detail, including non-functional requirements like performance and security, aimed more at the development team who will build it." },
  { type:"technical", text:"What techniques do you use to elicit requirements from stakeholders?",
    keywords:["interview","workshop","survey","observation","prototyp","brainstorm"], minWords:40, maxWords:200,
    example:"I use a mix depending on the situation: one-on-one interviews for detailed individual perspectives, workshops when I need to align multiple stakeholders at once, and direct observation of users doing their actual work, since people don't always describe their process accurately from memory. For less clear requirements, I'll build a quick prototype or mockup to get concrete feedback, since people often find it easier to react to something tangible than to describe it in the abstract." },
  { type:"technical", text:"Explain the INVEST criteria for a good user story.",
    keywords:["invest","independent","negotiable","valuable","estimable","small","testable"], minWords:40, maxWords:200,
    example:"INVEST stands for Independent, Negotiable, Valuable, Estimable, Small, and Testable. A good user story should stand on its own without heavy dependencies, be open to discussion rather than a rigid spec, deliver clear value to the user, be small enough for the team to estimate confidently, be sized to fit within a sprint, and have clear enough criteria that you can verify when it's actually done." },
  { type:"technical", text:"How would you write acceptance criteria for a new feature?",
    keywords:["given","when","then","specific","testable","edge case","condition"], minWords:40, maxWords:200,
    example:"I'd write them in a specific, testable format, often using Given/When/Then structure: given a starting condition, when an action happens, then a specific outcome should occur. For example, given a user is logged in with items in their cart, when they click checkout, then they should see the payment page. I'd make sure to cover edge cases and failure conditions too, not just the happy path, so the developer knows exactly what 'done' looks like." }
]},

itconsult: { name: "IT Consultant", questions: [
  { type:"behavioral", text:"Tell me about a time you had to quickly learn a new technology to solve a problem.",
    keywords:["learn","research","apply","deadline","documentation","solve"], minWords:50, maxWords:200,
    example:"A client needed a solution built on a platform I hadn't used before, with a tight deadline. I spent focused time going through documentation and tutorials to understand the core concepts, then built a small proof of concept to validate my understanding before committing to the full solution. Learning by building rather than just reading let me catch gaps in my understanding early, and I delivered the solution on time by staying disciplined about learning just enough to solve the actual problem." },
  { type:"behavioral", text:"Describe how you'd handle a disagreement with a client about the right technical solution.",
    keywords:["listen","understand","tradeoff","explain","recommend","respect","compromise"], minWords:50, maxWords:200,
    example:"I'd start by understanding why they favor their preferred solution, since clients sometimes have context I'm missing, like budget constraints or a past bad experience. I'd explain the tradeoffs of each option clearly, in business terms rather than pure technical jargon, and give my honest recommendation along with the reasoning behind it. Ultimately it's their decision and their business, so if they still choose differently after hearing the tradeoffs, I'd respect that and make sure my recommendation is documented for the record." },
  { type:"technical", text:"A client reports frequent system downtime. How would you diagnose the root cause?",
    keywords:["log","pattern","monitor","isolat","root cause","reproduc","recommend"], minWords:50, maxWords:200,
    example:"I'd start by gathering logs and monitoring data around the timing of the outages, looking for patterns like whether they correlate with traffic spikes, specific times of day, or recent deployments. I'd isolate whether it's a hardware, network, application, or database issue by checking each layer systematically rather than guessing. Once I identify the root cause, I'd propose both an immediate fix and a longer-term recommendation to prevent recurrence, since the underlying issue often points to a deeper architectural gap." },
  { type:"technical", text:"How do you assess a business's IT needs when you first start on a project?",
    keywords:["assess","current state","interview","pain point","goal","budget","gap"], minWords:50, maxWords:200,
    example:"I start by understanding the business goals first, not the technology, since IT decisions should serve the business rather than the other way around. I interview key stakeholders to understand current pain points and workflows, review existing systems and infrastructure, and identify gaps between where they are and where they need to be. I also factor in budget and timeline constraints early, since the ideal technical solution isn't useful if it's not realistic for the client." },
  { type:"technical", text:"How would you explain the tradeoffs of migrating a legacy system to the cloud to a non-technical client?",
    keywords:["simple","cost","benefit","risk","downtime","plain language"], minWords:50, maxWords:200,
    example:"I'd avoid technical jargon and frame it in terms they care about: cost, risk, and business impact. I'd explain that moving to the cloud can reduce the ongoing cost of maintaining physical hardware and make it easier to scale up during busy periods, but that the migration itself carries short-term risk and possible downtime, and some of their existing tools might need updates to work properly afterward. I'd lay out those tradeoffs plainly so they can make an informed decision rather than a purely technical one." }
]},

mgmtconsult: { name: "Management Consultant", questions: [
  { type:"behavioral", text:"Tell me about a time you influenced a decision without having formal authority.",
    keywords:["influence","data","build trust","relationship","persuade","credib"], minWords:50, maxWords:200,
    example:"As a junior team member on an engagement, I noticed our analysis pointed to a different recommendation than what senior leadership had assumed going in. Rather than pushing directly, I built a clear, data-backed case and walked my manager through it first to get buy-in, then we presented it together to the client. Having the data do the persuading, rather than my title, made it credible, and the client ultimately shifted their strategy based on the analysis." },
  { type:"behavioral", text:"Describe a time you had to deliver an unwelcome recommendation.",
    keywords:["difficult","honest","data","empathy","clear","prepare","constructive"], minWords:50, maxWords:200,
    example:"I once had to tell a client their flagship product line was underperforming badly enough that we recommended sunsetting it. I prepared thoroughly, making sure the data was airtight since I knew it would be a hard message to hear. I delivered it directly but with empathy, acknowledging it wasn't what they hoped to hear, and paired the difficult news with a concrete path forward, reallocating resources toward their stronger product lines, so the conversation ended with a plan rather than just bad news." },
  { type:"technical", text:"A retail client's profits have declined 20% over the last two years. How would you structure your approach to this case?",
    keywords:["revenue","cost","framework","hypothes","segment","structure","profit"], minWords:60, maxWords:250,
    example:"I'd break profit down into its core drivers: revenue and cost. On revenue, I'd look at whether the decline is from lower volume, lower prices, or a shift in product mix, and segment by store, region, or channel to see where it's concentrated. On cost, I'd check whether costs like labor, rent, or supply chain have risen. I'd form hypotheses for each branch, like new competition entering the market or a pricing misstep, and prioritize investigating the ones most likely to explain the size of the decline before drilling into data to confirm." },
  { type:"technical", text:"Should our client enter a new geographic market? How would you think about this?",
    keywords:["market size","competition","demand","cost","risk","framework"], minWords:60, maxWords:250,
    example:"I'd structure this around a few key questions: is the market attractive, meaning is there sufficient size and demand, and is the client positioned to compete, meaning do they have the right capabilities and resources. I'd look at market size and growth, competitive intensity, regulatory or cultural barriers to entry, and the cost of entering versus the expected return. I'd also weigh strategic fit, whether this market aligns with the client's broader goals, before landing on a recommendation with clear reasoning behind it." },
  { type:"technical", text:"Estimate the number of gas stations in a major city like Chicago.",
    keywords:["assumption","population","per capita","estimate","structure","sanity check"], minWords:50, maxWords:200,
    example:"I'd start with Chicago's population, roughly 2.7 million people, and estimate how many cars there might be per household, then estimate how many cars a typical gas station might serve per day based on pump count and turnover. I'd work through the math step by step, stating each assumption clearly, and sanity check the resulting number against what feels plausible for a city that size. The exact number matters less than showing structured, logical reasoning through clearly stated assumptions." }
]},

sysanalyst: { name: "Systems Analyst", questions: [
  { type:"behavioral", text:"Tell me about a time you had to communicate a technical issue to a non-technical stakeholder.",
    keywords:["simple","jargon","clear","impact","business terms"], minWords:40, maxWords:150,
    example:"When a database performance issue was slowing down a client-facing report, I explained it to the business owner in terms of impact rather than mechanics: the report that used to take seconds now takes minutes, and here's what we're doing to fix it, avoiding terms like query optimization or indexing. Framing it around what they'd actually experience, rather than the technical cause, kept them informed without overwhelming them." },
  { type:"behavioral", text:"Describe a project where you applied a specific SDLC methodology. What challenges came up?",
    keywords:["agile","waterfall","sprint","iterat","challenge","adapt"], minWords:50, maxWords:200,
    example:"On one project we used Agile with two-week sprints, which worked well for adapting to changing requirements but created a challenge around long-term planning, since stakeholders sometimes wanted a full project timeline upfront that clashed with Agile's iterative nature. We addressed it by maintaining a rough long-term roadmap alongside detailed sprint planning, giving stakeholders visibility into the big picture while still allowing the team to adapt sprint by sprint based on what we learned." },
  { type:"technical", text:"Walk me through the phases of the SDLC.",
    keywords:["planning","analysis","design","implementation","testing","deployment","maintenance"], minWords:50, maxWords:200,
    example:"The SDLC typically starts with planning, defining scope and feasibility, followed by requirements analysis to understand what needs to be built. Then comes design, architecting the solution, followed by implementation, actually writing the code. Testing verifies it works as intended, deployment releases it to production, and maintenance covers ongoing support, bug fixes, and updates after release. Depending on the methodology, these phases can happen once in sequence or repeat in short iterative cycles." },
  { type:"technical", text:"What's the difference between a Business Requirements Document and a Functional Requirements Specification?",
    keywords:["business requirement","why","functional requirement","what","high-level","detail"], minWords:30, maxWords:150,
    example:"A Business Requirements Document captures the high-level business goals and the 'why' behind a project, aimed at stakeholders and sponsors. A Functional Requirements Specification translates those goals into specific, detailed system behaviors, the 'what' the system must actually do, aimed more at the development and QA teams who will build and test it." },
  { type:"technical", text:"What is a context diagram, or Level 0 data flow diagram?",
    keywords:["context diagram","level 0","system boundary","external entity","data flow"], minWords:30, maxWords:150,
    example:"A context diagram, or Level 0 data flow diagram, shows the entire system as a single process and depicts how it interacts with external entities, like users or other systems, without showing any internal detail. It's used early in analysis to define the system's boundary, what's inside the system versus outside it, before breaking the process down into more detailed sub-processes in later, more granular diagrams." },
  { type:"technical", text:"How do you decide between Waterfall and Agile for a given project?",
    keywords:["requirement","certainty","change","fixed","iterative","risk"], minWords:40, maxWords:200,
    example:"It depends largely on how well-defined and stable the requirements are. Waterfall works well when requirements are clear upfront and unlikely to change, like regulatory or compliance-driven projects with fixed specifications. Agile works better when requirements are likely to evolve or aren't fully known yet, since it allows for iteration and course correction based on feedback. I'd also consider the client's culture; some organizations aren't set up to handle Agile's need for frequent stakeholder involvement." }
]},

program: { name: "Program Manager", questions: [
  { type:"behavioral", text:"Tell me about a time you managed dependencies across multiple teams on a complex initiative.",
    keywords:["dependency","coordinat","track","communicat","risk","align"], minWords:50, maxWords:200,
    example:"On a program involving three teams building interdependent components, I mapped out all the cross-team dependencies early, identifying which team's delay would block another's work. I set up a shared tracker and a recurring sync specifically focused on dependencies rather than each team's individual status, which surfaced a risk early: one team's API wouldn't be ready in time for another's integration work. We adjusted the sequencing to avoid a downstream delay." },
  { type:"behavioral", text:"Describe a time a project or initiative you were driving hit a major obstacle.",
    keywords:["obstacle","adapt","communicat","solution","stakeholder","recover"], minWords:50, maxWords:200,
    example:"Midway through a program, a key vendor we depended on missed a major deliverable, putting our timeline at risk. I immediately assessed the actual impact rather than panicking, communicated transparently to stakeholders about the delay and options, and worked with the team to identify an alternative path that reduced the vendor's remaining scope so we could hit a revised but still reasonable timeline. Being upfront about the setback, rather than hiding it, kept stakeholder trust intact." },
  { type:"technical", text:"How do you track and manage dependencies across several teams?",
    keywords:["tracker","dependency map","raid","visibility","regular","risk"], minWords:40, maxWords:200,
    example:"I maintain a shared dependency tracker, often as part of a broader RAID log, that documents what each team needs from another, by when, and the current status. I review it in a recurring cross-team sync so issues surface early rather than at the deadline, and I make it visible to all teams, not just something I keep privately, so anyone can flag a risk as soon as they see it." },
  { type:"technical", text:"Walk me through how you'd structure a program status update for senior leadership.",
    keywords:["summary","risk","milestone","concise","highlight","action"], minWords:40, maxWords:200,
    example:"I'd lead with a brief overall status, on track, at risk, or off track, since executives want the headline first. Then I'd cover key milestones achieved, upcoming milestones, and any risks or blockers, with a clear ask if I need a decision or support from leadership. I'd keep it concise, since senior leaders don't need the same operational detail the working teams do, and I'd back up any risk with a proposed mitigation rather than just raising a flag." },
  { type:"technical", text:"How would you prioritize competing requests from multiple stakeholders with limited resources?",
    keywords:["priorit","impact","framework","tradeoff","communicat","align"], minWords:40, maxWords:200,
    example:"I'd evaluate requests against consistent criteria, like business impact, urgency, and effort required, rather than whoever asks loudest. I'd make the tradeoffs visible to stakeholders so they understand why one request is being prioritized over another, which helps manage expectations even when someone doesn't get what they wanted immediately. Where possible I'd look for ways to sequence work so lower-priority requests aren't abandoned entirely, just scheduled later." }
]},

pm: { name: "Project Manager", questions: [
  { type:"behavioral", text:"Tell me about a time you managed a project with a tight deadline and limited resources.",
    keywords:["priorit","scope","resource","communicat","deadline","deliver"], minWords:50, maxWords:200,
    example:"I once had to deliver a client project in half the originally planned time after a scope change. I reprioritized the backlog to focus only on must-have features, communicated the tradeoffs clearly to the client so they understood what was being deferred, and reallocated team members to the highest-impact tasks. We delivered the core functionality on time and scheduled the deferred items for a fast-follow release, which the client was satisfied with since they understood the reasoning upfront." },
  { type:"behavioral", text:"Describe how you handled a difficult stakeholder or team conflict.",
    keywords:["listen","mediate","communicat","resolve","understand","compromise"], minWords:50, maxWords:200,
    example:"Two team members disagreed sharply about the technical approach for a deliverable, and it was starting to affect team morale. I met with each of them separately first to understand their concerns without the pressure of the group setting, then brought them together to focus the conversation on the project's goals rather than personal preference. We landed on a hybrid approach that addressed both of their core concerns, and I followed up afterward to make sure the resolution actually stuck." },
  { type:"technical", text:"Walk me through the phases of the project management lifecycle.",
    keywords:["initiat","planning","execut","monitor","closing","phase"], minWords:40, maxWords:200,
    example:"The lifecycle typically has five phases: initiation, defining the project's purpose and getting approval; planning, building out scope, timeline, and resources; execution, doing the actual work; monitoring and controlling, tracking progress and managing changes; and closing, wrapping up deliverables, documenting lessons learned, and formally ending the project. Monitoring actually happens throughout execution rather than as a separate sequential phase." },
  { type:"technical", text:"What project management tools have you used, and how do you use them to track progress?",
    keywords:["jira","asana","trello","gantt","board","track","status"], minWords:40, maxWords:200,
    example:"I've used Jira for sprint-based tracking, with a board showing tasks moving through stages like to-do, in progress, and done, along with burndown charts to monitor velocity against the sprint goal. For more traditional timeline-based projects, I've used Gantt charts to visualize dependencies and critical path. I check these regularly, not just at status meetings, so I can catch a slipping task early rather than finding out at the deadline." },
  { type:"technical", text:"What's the difference between Agile and Waterfall, and when would you use each?",
    keywords:["agile","iterative","waterfall","sequential","requirement","change"], minWords:40, maxWords:200,
    example:"Waterfall is a sequential approach where each phase, like requirements, design, and build, finishes before the next begins, which works well when requirements are stable and well understood upfront. Agile is iterative, delivering work in short cycles with continuous feedback, which suits projects where requirements are likely to evolve or aren't fully clear at the start. I'd choose Waterfall for something like a regulatory compliance project with fixed specs, and Agile for a product where user feedback will shape the direction." },
  { type:"technical", text:"What is an escalation path, and when would you use one?",
    keywords:["escalat","blocker","authority","risk","timely","decision"], minWords:30, maxWords:150,
    example:"An escalation path is the defined chain for raising an issue to someone with the authority to resolve it when it can't be solved at the current level, like a blocker that needs budget approval or a decision above the project manager's authority. I'd use it when a blocker is at risk of derailing the timeline and I've exhausted my own options, since escalating early, with clear context, is usually better than silently hoping the issue resolves itself." }
]},

ux: { name: "User Experience Designer", questions: [
  { type:"behavioral", text:"Walk me through your portfolio — pick one project and explain your process.",
    keywords:["research","problem","iterat","user","test","outcome","process"], minWords:60, maxWords:250,
    example:"I'll walk through a mobile app redesign I led. I started with user research, interviews and a survey, to understand where people were struggling in the existing flow, and found onboarding was the biggest drop-off point. I sketched several concepts, tested low-fidelity prototypes with real users, and iterated based on their feedback before moving to high-fidelity designs. After launch, onboarding completion improved significantly, which validated the direction, though I'd also share what I'd do differently in hindsight." },
  { type:"behavioral", text:"Tell me about a time user feedback contradicted your design assumptions. What did you do?",
    keywords:["assumption","feedback","test","iterat","humble","adapt","data"], minWords:50, maxWords:200,
    example:"I assumed a simplified checkout flow with fewer steps would improve conversion, but usability testing showed users actually felt anxious with the condensed version because it hid information they wanted to confirm before paying, like shipping cost. Rather than defending my original design, I revised it to keep the flow short but surface that key information more transparently, which tested much better. It reinforced that my instincts as a designer aren't a substitute for actually testing with real users." },
  { type:"technical", text:"Design an interface for a specific constrained context (e.g., an ATM redesigned for a first-time user). Walk me through your process.",
    keywords:["user need","constraint","accessib","flow","sketch","prototyp","test"], minWords:60, maxWords:250,
    example:"I'd start by clarifying the user and constraints: a first-time user, likely stressed or in a hurry, with a small physical screen and limited input methods. I'd map out the core flow, like inserting a card, selecting an amount, and completing the transaction, and prioritize clarity over density, using large, plain-language buttons instead of banking jargon. I'd sketch the flow, consider accessibility needs like text size and contrast, and test it with people unfamiliar with the machine to see where confusion happens." },
  { type:"technical", text:"How do you validate a design decision?",
    keywords:["usability test","data","user feedback","a/b test","metric","iterat"], minWords:40, maxWords:200,
    example:"I rely on a mix of qualitative and quantitative validation depending on the stage. Early on, I'll run usability tests with a handful of real users to catch obvious confusion or friction. Post-launch, I'll look at behavioral data and metrics, like completion rate or drop-off points, and sometimes run an A/B test if I need statistical confidence between two approaches. I try not to rely purely on opinion or intuition, mine or a stakeholder's, when real user behavior can settle the question." },
  { type:"technical", text:"Walk me through your process for designing a new feature from scratch.",
    keywords:["research","problem","sketch","wireframe","prototype","test","iterat"], minWords:50, maxWords:250,
    example:"I start by clarifying the actual user problem the feature is meant to solve, since jumping straight to solutions risks building the wrong thing well. I'll do some light research if needed, sketch a few different directions, and narrow to the strongest concept before building wireframes and then a clickable prototype. I test the prototype with real users to catch usability issues early, when they're cheap to fix, and iterate before it goes to engineering for build." }
]}

};

/* ------------------------ scoring engine ------------------------ */

function countWords(text){ return (text.trim().match(/\S+/g) || []).length; }

function pickRandomQuestions(careerKey, count){
  count = count || 3;
  const pool = CAREERS[careerKey].questions.slice();
  const picked = [];
  while(picked.length < count && pool.length > 0){
    const i = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(i,1)[0]);
  }
  return picked;
}

function scoreKeywords(answer, keywords){
  const lower = answer.toLowerCase();
  const hit = [], missed = [];
  keywords.forEach(kw => (lower.includes(kw.toLowerCase()) ? hit : missed).push(kw));
  return { hit, missed, pct: keywords.length ? hit.length/keywords.length : 0 };
}

function checkLength(answer, minWords, maxWords){
  const words = countWords(answer);
  if(words === 0) return { status:"empty", words };
  if(words < minWords) return { status:"short", words };
  if(words > maxWords) return { status:"long", words };
  return { status:"good", words };
}

function checkGrammar(answer){
  const issues = [];
  const trimmed = answer.trim();
  if(trimmed.length === 0) return issues;

  if(/^[a-z]/.test(trimmed)) issues.push("Start your answer with a capital letter.");
  if(!/[.!?]["')]?$/.test(trimmed)) issues.push("End your sentences with punctuation (., !, or ?).");
  if(/  +/.test(trimmed)) issues.push("Watch for extra spaces between words.");

  const repeated = trimmed.match(/\b(\w+)\s+\1\b/gi);
  if(repeated) issues.push('You repeated a word: "' + repeated[0] + '".');

  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const lowercaseStarts = sentences.filter(s => /^[a-z]/.test(s.trim())).length;
  if(lowercaseStarts > 0 && sentences.length > 1){
    issues.push("Some sentences don't start with a capital letter — check sentence boundaries.");
  }

  for(const s of sentences){
    const conj = (s.match(/\b(and|but|so|because)\b/gi) || []).length;
    if(conj >= 3 && countWords(s) > 40){
      issues.push("One of your sentences may be a run-on — consider breaking it into two.");
      break;
    }
  }

  if(/\bi\b/.test(trimmed) && !/\bI\b/.test(trimmed)) issues.push('Capitalize "I" when referring to yourself.');

  return issues;
}

function buildFeedback(question, answer){
  const { hit, missed, pct } = scoreKeywords(answer, question.keywords);
  const length = checkLength(answer, question.minWords, question.maxWords);
  const grammar = checkGrammar(answer);

  if(length.status === "empty"){
    return {
      headline: "Let's give this one a try.",
      messages: ["Type an answer before submitting so I can give you feedback on it."],
      example: question.example
    };
  }

  const messages = [];

  if(pct >= 0.7){
    messages.push("Strong coverage — your answer touched on " + hit.length + " of the " + question.keywords.length + " key ideas a strong response usually includes.");
  } else if(pct >= 0.35){
    messages.push("Good start. You covered " + hit.length + " of " + question.keywords.length + " key ideas. Consider also addressing: " + missed.slice(0,4).join(", ") + ".");
  } else {
    messages.push("This is a good opportunity to go deeper. Strong answers to this question usually mention things like: " + missed.slice(0,5).join(", ") + ".");
  }

  if(length.status === "short"){
    messages.push("Your answer is a bit brief (" + length.words + " words). Aim for roughly " + question.minWords + "-" + question.maxWords + " words so you have room for a specific example and your reasoning.");
  } else if(length.status === "long"){
    messages.push("Your answer is quite long (" + length.words + " words). Try tightening it to around " + question.minWords + "-" + question.maxWords + " words.");
  } else {
    messages.push("Your answer length (" + length.words + " words) is right in the sweet spot for this question.");
  }

  if(grammar.length > 0){
    messages.push("A couple of small polish points: " + grammar.join(" "));
  } else {
    messages.push("No grammar or mechanics issues stood out — nice and clean.");
  }

  const headline = (pct >= 0.7 && length.status === "good" && grammar.length === 0) ? "Great answer!"
    : (pct >= 0.35) ? "Solid effort — here's how to strengthen it."
    : "Nice try — here's how to build a stronger answer.";

  return { headline, messages, example: question.example };
}

/* ------------------------ UI wiring ------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  const careerSelect = document.getElementById("careerSelect");
  const interviewView = document.getElementById("interviewView");
  const doneView = document.getElementById("doneView");
  const qCounter = document.getElementById("qCounter");
  const progressFill = document.getElementById("progressFill");
  const qTypeLabel = document.getElementById("qTypeLabel");
  const questionText = document.getElementById("questionText");
  const answerBox = document.getElementById("answerBox");
  const wordCount = document.getElementById("wordCount");
  const submitBtn = document.getElementById("submitBtn");
  const restartBtn = document.getElementById("restartBtn");
  const restartBtn2 = document.getElementById("restartBtn2");
  const feedbackWrap = document.getElementById("feedbackWrap");

  let sessionQuestions = [];
  let qIndex = 0;

  careerSelect.addEventListener("change", () => {
    const key = careerSelect.value;
    if(!key) return;
    sessionQuestions = pickRandomQuestions(key, 3);
    qIndex = 0;
    doneView.style.display = "none";
    interviewView.style.display = "block";
    renderQuestion();
  });

  function renderQuestion(){
    const q = sessionQuestions[qIndex];
    qCounter.textContent = "Question " + (qIndex+1) + " of " + sessionQuestions.length;
    progressFill.style.width = Math.round((qIndex / sessionQuestions.length) * 100) + "%";
    qTypeLabel.textContent = q.type === "behavioral" ? "Behavioral" : "Technical";
    questionText.textContent = q.text;
    answerBox.value = "";
    answerBox.disabled = false;
    wordCount.textContent = "0 words";
    feedbackWrap.innerHTML = "";
    submitBtn.style.display = "inline-block";
    answerBox.focus();
  }

  answerBox.addEventListener("input", () => {
    wordCount.textContent = countWords(answerBox.value) + " words";
  });

  submitBtn.addEventListener("click", () => {
    const q = sessionQuestions[qIndex];
    const fb = buildFeedback(q, answerBox.value);

    answerBox.disabled = true;
    submitBtn.style.display = "none";

    const card = document.createElement("div");
    card.className = "best-match-card";

    const h3 = document.createElement("h3");
    h3.textContent = fb.headline;
    card.appendChild(h3);

    fb.messages.forEach(m => {
      const p = document.createElement("p");
      p.textContent = m;
      card.appendChild(p);
    });

    const exampleLabel = document.createElement("p");
    exampleLabel.innerHTML = "<strong>A strong sample answer:</strong>";
    card.appendChild(exampleLabel);

    const exampleText = document.createElement("p");
    exampleText.textContent = fb.example;
    card.appendChild(exampleText);

    const nextBtn = document.createElement("button");
    nextBtn.className = "nav-btn primary";
    nextBtn.style.marginTop = "10px";
    nextBtn.textContent = qIndex < sessionQuestions.length - 1 ? "Next Question" : "Finish Session";
    nextBtn.addEventListener("click", () => {
      qIndex++;
      if(qIndex >= sessionQuestions.length){
        interviewView.style.display = "none";
        doneView.style.display = "block";
      } else {
        renderQuestion();
      }
    });
    card.appendChild(nextBtn);

    feedbackWrap.appendChild(card);
  });

  function resetAll(){
    careerSelect.value = "";
    sessionQuestions = [];
    qIndex = 0;
    interviewView.style.display = "none";
    doneView.style.display = "none";
  }
  restartBtn.addEventListener("click", resetAll);
  restartBtn2.addEventListener("click", resetAll);
});