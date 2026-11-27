-- Draft sources for verified answers (spec section 7). Written by Claude on 2026-11-27 in plain language, in our own
-- words, from pages and papers checked that day (each document lists its sources). Nothing is copied word for word:
-- WHO material is CC BY-NC-SA (no use on a site with paid plans), and CDC asks that reproduced text stay unchanged,
-- so we summarise and cite instead.
--
-- Every row is a DRAFT. The AI uses none of it until an owner reads it and approves it on /staff/knowledge
-- (editorial review). Answers from these sources say "not yet reviewed by a clinician" until a clinical reviewer
-- upgrades them. After applying: /staff/knowledge -> "Index sources that have no passages yet".
--
-- Note (2026-11-27): CDC's "Autism and Vaccines" page was rewritten in July 2026 and now departs from the
-- scientific consensus. It is deliberately not used; the vaccines section cites WHO and peer-reviewed studies.

insert into public.kb_sources (key, title, publisher, url, licence, language, origin, body, created_by_label) values

('nr-screening-vs-diagnosis', 'Screening and diagnosis: what is the difference?', 'NeuRafiki, from CDC and NICHD guidance',
 'https://www.cdc.gov/autism/diagnosis/index.html',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# Screening is not diagnosis
A screening, like NeuRafiki, looks at whether some areas of development or behaviour may be worth a closer look. A screening tool cannot give a diagnosis. If a screening raises a concern, the next step is a full evaluation by trained professionals (CDC, Screening for Autism Spectrum Disorder).

Signs on their own cannot show whether someone has a condition. Many children struggle at times. A professional looks for several related signs that last over time (NICHD, signs of learning disabilities).

# What a diagnosis involves
A diagnosis is made by qualified professionals after a full assessment. There is no blood test for autism. Professionals look at the person's developmental history and behaviour, and may use observation, structured tests, interviews with parents or carers, and questionnaires (CDC). For learning difficulties, a full evaluation can include a medical check to rule out other causes, a review of developmental, school and family history, and educational and psychological testing, usually by a team (NICHD).

# Who can diagnose
Depending on the area, this can be a developmental paediatrician, a child psychologist or psychiatrist, a speech and language therapist, an occupational therapist, or a school or educational psychologist (CDC; NICHD). For adults, the first step is usually a general doctor, who can refer to a mental health or specialist service (CDC, ADHD in Adults).

# What your NeuRafiki results mean
Your results show areas where the answers given indicate elevated traits. They do not show whether anyone has a condition. Take them to a qualified professional as a starting point for a conversation.

# Sources
- CDC. Screening for Autism Spectrum Disorder. https://www.cdc.gov/autism/diagnosis/index.html (reviewed 1 October 2026)
- NICHD (NIH). What are some signs of learning disabilities? and How are learning disabilities diagnosed? https://www.nichd.nih.gov/health/topics/learning/conditioninfo
- CDC. ADHD in Adults. https://www.cdc.gov/adhd/about/adhd-in-adults.html$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-autism-what-is', 'What is autism?', 'NeuRafiki, from WHO, CDC and NIMH',
 'https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# What autism is
Autism, also called autism spectrum disorder (ASD), is a diverse group of conditions related to how the brain develops (WHO, Autism fact sheet, 2025). It affects how people interact with others, communicate, learn and behave (NIMH). Autism now includes what used to be called autistic disorder, PDD-NOS and Asperger syndrome (CDC).

# How common it is
WHO estimates that in 2021 about 1 in 127 people worldwide were autistic. This is an average: figures vary a lot between studies, and in many low- and middle-income countries, including much of Africa, the true number is not known (WHO).

# Every autistic person is different
Abilities and needs vary widely and can change over time. Some autistic people live independently. Others have severe disabilities and need lifelong care and support (WHO). Intellectual ability ranges from profound disability to very high ability (WHO).

# When it shows
Signs usually appear in the first two years of life, but autism can be diagnosed at any age (NIMH). Many people are diagnosed much later, as teenagers or adults (CDC; WHO).

# Sources
- WHO. Autism (fact sheet), 17 September 2025. https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders
- NIMH (NIH). Autism Spectrum Disorder. https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders-asd (reviewed December 2024)
- CDC. Screening for Autism Spectrum Disorder. https://www.cdc.gov/autism/diagnosis/index.html$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-autism-signs-children', 'Signs of autism in young children', 'NeuRafiki, from CDC',
 'https://www.cdc.gov/autism/signs-symptoms/index.html',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# Two main areas
Autistic people often have differences in social communication and interaction, and restricted or repetitive behaviours or interests. They may also learn, move or pay attention in different ways (CDC, Signs and Symptoms of Autism Spectrum Disorder).

# Social communication: examples by age
CDC gives these examples of signs that may be worth asking a professional about (CDC):
- avoids or does not keep eye contact
- by about 9 months: does not respond to their name, or show facial expressions such as happy, sad or surprised
- by about 12 months: does not play simple back-and-forth games like pat-a-cake, and uses few or no gestures such as waving goodbye
- by about 15 months: does not show you things they like
- by about 18 months: does not point to show you something interesting
- by about 2 years: does not notice when others are hurt or upset
- by about 3 years: does not notice other children or join them in play
- by about 4 years: does not pretend during play, for example to be a teacher
- by about 5 years: does not sing, dance or act for you

# Repetitive behaviours and interests: examples
Lining up toys and getting upset when the order changes; repeating words or phrases; playing with toys the same way every time; focusing on parts of objects such as wheels; getting upset by small changes; very strong interests; needing to follow certain routines; flapping hands, rocking or spinning; unusual reactions to sounds, smells, tastes, sights or textures (CDC).

# Other things that can go with autism
Delayed language, movement or learning; hyperactive, impulsive or inattentive behaviour; seizures; unusual eating or sleeping; stomach problems such as constipation; anxiety or worry; unusual moods; and less or more fear than expected (CDC).

# Important
A child may show some, all or none of these. Children who are not autistic can show some of them too (CDC). Only a qualified professional can say whether a child is autistic.

# Sources
- CDC. Signs and Symptoms of Autism Spectrum Disorder. https://www.cdc.gov/autism/signs-symptoms/index.html (16 May 2024)$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-autism-diagnosis', 'How autism is identified and diagnosed', 'NeuRafiki, from CDC and WHO',
 'https://www.cdc.gov/autism/diagnosis/index.html',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# Three steps
- Developmental monitoring: parents, carers, teachers and health workers watching how a child grows and whether they reach milestones (CDC). WHO recommends monitoring child development as part of routine mother and child health care (WHO).
- Developmental screening: a more formal check using a short questionnaire. US paediatric guidance recommends general developmental screening at 9, 18 and 30 months, and autism-specific screening at 18 and 24 months. Extra screening helps when there are concerns, or when a brother or sister is autistic (CDC).
- Diagnostic evaluation: if screening raises a concern, one or more trained specialists carry out a full evaluation (CDC).

# Who does the evaluation
A developmental paediatrician, child psychologist, speech and language therapist and/or occupational therapist. It may include watching the child, structured tests, interviews with parents and questionnaires. Genetic counselling and testing are sometimes recommended (CDC).

# How early and how late
Autism can sometimes be detected at 18 months or younger, and by age 2 a diagnosis by an experienced professional can be considered reliable (CDC). Many children are not diagnosed until much older, and some people only as teenagers or adults, which can delay help (CDC). WHO notes that signs may appear in early childhood while diagnosis often comes much later (WHO).

# If you are worried
You can ask a health worker for a developmental check even if one is not offered (CDC). After a diagnosis, families should be offered information, services, referrals and practical support (WHO).

# Sources
- CDC. Screening for Autism Spectrum Disorder. https://www.cdc.gov/autism/diagnosis/index.html (reviewed 1 October 2026)
- WHO. Autism (fact sheet), 17 September 2025. https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-autism-adults', 'Autism in teenagers and adults, and late diagnosis', 'NeuRafiki, from WHO, NIMH and CDC',
 'https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders-asd',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# It is never too late to ask
Autism can be diagnosed at any age (NIMH). Some people are not diagnosed until they are teenagers or adults (CDC), and WHO notes that diagnosis often comes much later than the first signs (WHO). Many adults in their 30s, 40s and beyond start to wonder about autism, often after a child or relative is diagnosed. Wondering is a good reason to seek an assessment.

# Why it can matter
Autistic people have the same health needs as everyone else, plus autism-related needs. They have higher rates of unmet health needs and are more likely to have conditions such as anxiety, depression, ADHD and epilepsy (WHO). Understanding yourself better can help you find the right support at work, at home and with your health.

# How adults can get assessed for autism
- Start with a general doctor or a mental health service, and explain why you are asking. Bring examples from childhood and from now, at home and at work.
- If you can, bring someone who knew you as a child, such as a parent or older relative, or written notes from them.
- A screening like NeuRafiki can help you organise what you have noticed, but it is not a diagnosis.

# Sources
- NIMH (NIH). Autism Spectrum Disorder. https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders-asd
- CDC. Screening for Autism Spectrum Disorder. https://www.cdc.gov/autism/diagnosis/index.html
- WHO. Autism (fact sheet), 17 September 2025. https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-adhd-what-signs', 'What is ADHD, and what are the signs?', 'NeuRafiki, from CDC and NIMH',
 'https://www.cdc.gov/adhd/signs-symptoms/index.html',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# What ADHD is
Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental condition involving inattention, hyperactivity and impulsivity. To count as ADHD, these behaviours must happen often, in more than one setting, and get in the way of daily life (NIMH). It is one of the most common conditions diagnosed in children. It starts in childhood and usually continues into the teenage years and adulthood (NIMH). Children do not simply grow out of it (CDC).

# Three ways it can show
- Mostly inattentive: hard to organise or finish tasks, pay attention to details, or follow instructions or conversations; easily distracted; forgets daily routines.
- Mostly hyperactive-impulsive: fidgets and talks a lot; finds it hard to sit still; young children may run, jump or climb constantly; interrupts, grabs things, finds waiting a turn hard; may have more accidents.
- Combined: both kinds of signs equally.
The way it shows can change over time (CDC).

# Everyday examples in children
Daydreaming a lot, forgetting or losing things, squirming or fidgeting, talking too much, careless mistakes or unnecessary risks, trouble resisting temptation or taking turns, and difficulty getting along with others (CDC).

# Things that can look similar
Sleep problems, anxiety, depression and some learning difficulties can look like ADHD, which is one reason a proper assessment matters (CDC). ADHD also often occurs alongside learning difficulties, sleep problems, anxiety or depression (NIMH).

# Sources
- CDC. Symptoms of ADHD. https://www.cdc.gov/adhd/signs-symptoms/index.html (reviewed 30 July 2026)
- NIMH (NIH). Attention-Deficit/Hyperactivity Disorder (ADHD). https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd (reviewed August 2026)$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-adhd-diagnosis', 'How ADHD is diagnosed in children', 'NeuRafiki, from CDC',
 'https://www.cdc.gov/adhd/diagnosis/index.html',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# No single test
There is no single test for ADHD. Diagnosis takes several steps. It includes a medical check, with hearing and vision tests, to rule out other problems that can look similar (CDC, Diagnosing ADHD).

# Who can diagnose
A psychologist or psychiatrist, or a primary care doctor such as a paediatrician (CDC).

# Information from more than one place
Professionals ask parents, teachers and other adults how the child behaves in different settings, such as home, school and with friends, and check for other conditions that might explain the signs or occur alongside ADHD (CDC, citing American Academy of Pediatrics guidance).

# Getting started
Talk to a health worker first. Schools can often help by sharing what teachers notice; ask whether your school or education authority offers an assessment (CDC describes free school evaluations in the United States; services differ by country).

# Sources
- CDC. Diagnosing ADHD. https://www.cdc.gov/adhd/diagnosis/index.html (reviewed 21 October 2026)
- CDC. Symptoms of ADHD. https://www.cdc.gov/adhd/signs-symptoms/index.html$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-adhd-adults', 'ADHD in adults', 'NeuRafiki, from CDC and NIMH',
 'https://www.cdc.gov/adhd/about/adhd-in-adults.html',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# Many adults were never diagnosed
ADHD develops in childhood and often lasts into adulthood. Some adults have ADHD but were never diagnosed, and many people are diagnosed as adults (CDC, ADHD in Adults).

# How it can look in adults
Signs may look different from childhood. Hyperactivity may fade or show as strong inner restlessness. Adults may struggle to manage attention, finish long tasks unless they are interesting, stay organised, or control impulses. Symptoms can feel worse as responsibilities grow, causing difficulty at work, at home or in relationships, and can affect sleep, eating, exercise and health habits, especially under stress (CDC). Teenagers and adults with ADHD are at higher risk of risky behaviour, job difficulties and money problems (NIMH).

# Getting assessed as an adult
- Start by talking to a doctor, who may assess you or refer you to a mental health professional (CDC).
- The assessment usually includes a symptom checklist and your history. The professional will want to know whether signs were present before age 12, and may ask people who know you, such as family or friends (CDC).
- They may also check for things that can look similar, such as anxiety, depression, sleep problems, substance use or learning difficulties (CDC).

# Help exists
ADHD can often be managed. Support can include therapy and practical changes at work. A doctor will discuss whether medicine is right for you; NeuRafiki does not give advice on medicines (CDC; NIMH).

# Sources
- CDC. ADHD in Adults. https://www.cdc.gov/adhd/about/adhd-in-adults.html (reviewed 1 September 2026)
- NIMH (NIH). Attention-Deficit/Hyperactivity Disorder (ADHD). https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-learning-dyslexia', 'Dyslexia and other learning difficulties', 'NeuRafiki, from NICHD',
 'https://www.nichd.nih.gov/health/topics/learning/conditioninfo',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# What dyslexia and other learning difficulties are
Learning disabilities (also called specific learning difficulties) affect how a person learns to read, write, speak or do maths. They come from differences in how the brain works. They are not a measure of intelligence, and people with them can do very well with the right support (NICHD). They often become noticeable at school, can last a lifetime, and a person can have more than one (NICHD).
- Dyslexia: difficulty reading words accurately and fluently, and sometimes with spelling and understanding sentences.
- Dysgraphia: difficulty with handwriting, forming letters, and getting thoughts onto paper.
- Dyscalculia: difficulty with number concepts, sums and measuring (NICHD).

# Possible signs
Difficulties with reading, writing, maths, memory, attention, following directions, organisation, telling time or coordination; also trouble expressing thoughts, uneven school results, or difficulty with changes in routine. Many children struggle at times; a learning difficulty usually shows as several related signs that last. Children learning in a second language or speaking a local dialect need an assessment that takes this into account (NICHD).

# Diagnosis
Only a professional can diagnose a learning difficulty. A full evaluation can include a medical check, a look at development, school and family history, and educational and psychological tests, usually by a team such as a psychologist, a special education specialist and a speech and language therapist (NICHD).

# Does it go away?
There is no cure, but early help can greatly reduce the effects, and untreated difficulties can lead to frustration and low self-esteem. Good support builds on strengths. Examples: structured, intensive reading teaching and extra time for dyslexia; oral tests or speech-to-text for writing difficulties; visual aids for maths (NICHD).

# Sources
- NICHD (NIH). About Learning Disabilities; signs; diagnosis; treatments. https://www.nichd.nih.gov/health/topics/learning/conditioninfo (reviewed 11 September 2018)$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-dld-language', 'Developmental language disorder (DLD)', 'NeuRafiki, from NIDCD',
 'https://www.nidcd.nih.gov/health/developmental-language-disorder',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# What DLD is
Developmental language disorder makes it hard to learn, understand and use language. It is not explained by hearing loss, autism or too little exposure to language. It can affect speaking, listening, reading and writing. It affects about 1 in 14 children starting school, and its effects continue into adulthood (NIDCD).

# Causes
It is a difference in brain development. It runs in families. Learning more than one language does not cause DLD and does not harm a child with DLD (NIDCD).

# Signs
- Younger children: often late talkers; late to put words together; trouble learning words, following directions and having conversations; frequent grammar mistakes.
- Older children and adults: few complex sentences, trouble finding words, difficulty with figurative language, reading problems, disorganised stories or writing, and many grammar and spelling mistakes.
Language difficulties are sometimes mistaken for shyness or bad behaviour (NIDCD).

# Diagnosis and help
A speech and language therapist assesses the child, using observation, interviews and questionnaires with parents and teachers, and standard language tests. Therapy works best when started early, but older children and adults also benefit. DLD increases the risk of reading, spelling and maths difficulties (NIDCD).

# Sources
- NIDCD (NIH). Developmental Language Disorder. https://www.nidcd.nih.gov/health/developmental-language-disorder (updated 8 May 2023)$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-dcd-dyspraxia', 'Developmental coordination disorder (DCD, dyspraxia)', 'NeuRafiki, from international clinical guidance',
 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6850610/',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# What DCD is
Developmental coordination disorder, often called dyspraxia, is a condition where learning and carrying out coordinated movements is much harder than expected for a person's age. It affects everyday activities such as dressing, handwriting, using cutlery, sports and riding a bicycle, and it is not explained by another medical or neurological condition. International clinical practice recommendations, led by the European Academy of Childhood Disability, set out how it should be defined, assessed and supported (Blank et al., 2019).

# Assessment
Diagnosis is made by qualified professionals, for example a doctor together with an occupational therapist or physiotherapist, who look at movement skills, how they affect daily life and school, and rule out other causes (Blank et al., 2019).

# Support
The recommendations favour activity-focused and participation-focused approaches: practising the real tasks a child needs and wants to do, in everyday settings. Active video games may help as an extra, not a replacement. The recommendations also cover teenagers and adults with DCD, and the emotional and social side (Blank et al., 2019).

# Sources
- Blank R, Barnett AL, Cairney J, et al. International clinical practice recommendations on the definition, diagnosis, assessment, intervention, and psychosocial aspects of developmental coordination disorder. Developmental Medicine and Child Neurology 2019;61(3):242-285. doi:10.1111/dmcn.14132$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-myths-causes', 'Myths about causes and cures', 'NeuRafiki, from WHO and peer-reviewed research',
 'https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# What causes autism
Research points to many factors, both genetic and environmental, that make it more likely a child will be autistic. Factors reported more often include older parents, diabetes during pregnancy, being born early or with a very low birth weight, severe birth complications, exposure in pregnancy to air pollution or some heavy metals, and two anti-seizure medicines taken in pregnancy. More research is needed (WHO, Autism fact sheet, 2025). Autism and ADHD are differences in how the brain develops (CDC; NIMH). They are not caused by bad parenting, by something the family did, or by a child being naughty.

# Vaccines do not cause autism
Extensive research shows the MMR vaccine does not cause autism. The study that claimed a link was shown to be wrong and fraudulent; the journal withdrew it and the author lost his medical licence. Other childhood vaccines, and vaccine ingredients such as thiomersal and aluminium, have not been found to increase the risk (WHO). A Danish study of 657,461 children found no increased risk of autism after MMR vaccination (Hviid et al., 2019). A review of studies covering more than 1.2 million children found no link between vaccines and autism (Taylor et al., 2014).

# Curses, witchcraft and spiritual causes
Some families are told that autism or another difference is caused by a curse, witchcraft or a punishment. Research does not support this: the causes found are in brain development, genes and pregnancy (WHO). Beliefs like these can lead to stigma and to children being kept from school or health care (WHO describes autistic people being unjustly denied health care and education). Faith and community can be a real source of strength; they work best alongside proven support, not instead of it.

# Cures
There is no medicine, diet, programme or treatment that cures autism, ADHD, dyslexia or DLD. These are lifelong differences, although needs and abilities can change over time and support can make a big difference (WHO; NICHD; NIDCD). Be careful of anyone who sells a cure. Proven help includes psychosocial support that builds communication and social skills, good teaching approaches, therapy, and support for families (WHO; NICHD).

# Sources
- WHO. Autism (fact sheet), 17 September 2025. https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders
- Hviid A, Hansen JV, Frisch M, Melbye M. Measles, Mumps, Rubella Vaccination and Autism: A Nationwide Cohort Study. Annals of Internal Medicine 2019;170(8):513-520. doi:10.7326/M18-2101
- Taylor LE, Swerdfeger AL, Eslick GD. Vaccines are not associated with autism: an evidence-based meta-analysis of case-control and cohort studies. Vaccine 2014;32(29):3623-3629. doi:10.1016/j.vaccine.2014.04.085
- NICHD (NIH). Treatments for learning disabilities. https://www.nichd.nih.gov/health/topics/learning/conditioninfo/treatment
- NIDCD (NIH). Developmental Language Disorder. https://www.nidcd.nih.gov/health/developmental-language-disorder$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-after-screening', 'After a screening: next steps and finding help', 'NeuRafiki, from WHO, CDC and research in Africa',
 'https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# Your results are a starting point
A screening can show areas worth a closer look, but it cannot diagnose (CDC). If your results raise concerns, the next step is an assessment by a qualified professional.

# Who to see
Start with a doctor, a clinic or a teaching hospital and ask for a developmental assessment or a referral. Depending on the concern, you may be referred to a paediatrician or developmental paediatrician, a child psychologist or psychiatrist, a speech and language therapist, an occupational therapist, or an educational psychologist (CDC; NICHD; NIDCD). Adults can start with a general doctor or a mental health service (CDC).

# Preparing for the appointment
- Bring your NeuRafiki results and examples of what you have noticed, at home, at school or work, and with friends.
- Note when you first noticed things, and whether they happen in more than one place.
- Bring school reports or notes from teachers if you have them; professionals often want information from more than one setting (CDC).
- Write down your questions, for example: What else could explain this? What assessment do you recommend? What support can we start now?

# Services in Africa
Research on autism in sub-Saharan Africa has found big gaps: few large studies, few studies of early intervention, school-based support or adults, and a need for much more clinical training and services (Franz et al., 2017). Waiting lists can be long and services may be far away. While you wait, you can still learn about your child's needs, talk with the school, and connect with parent groups and organisations. The ANDA directory lists support organisations across Africa.

# Your rights
Everyone, including autistic people, has the right to the highest attainable standard of health. Once there is a diagnosis, families should be offered information, services, referrals and practical support (WHO).

# Sources
- CDC. Screening for Autism Spectrum Disorder. https://www.cdc.gov/autism/diagnosis/index.html
- CDC. Diagnosing ADHD. https://www.cdc.gov/adhd/diagnosis/index.html
- NICHD (NIH). How are learning disabilities diagnosed? https://www.nichd.nih.gov/health/topics/learning/conditioninfo/diagnosed
- NIDCD (NIH). Developmental Language Disorder. https://www.nidcd.nih.gov/health/developmental-language-disorder
- Franz L, Chambers N, von Isenburg M, de Vries PJ. Autism spectrum disorder in sub-Saharan Africa: a comprehensive scoping review. Autism Research 2017;10(5):723-749. doi:10.1002/aur.1766
- WHO. Autism (fact sheet), 17 September 2025. https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-support-home', 'Support at home and for caregivers', 'NeuRafiki, from WHO',
 'https://www.who.int/teams/mental-health-and-substance-use/treatment-care/who-caregivers-skills-training-for-families-of-children-with-developmental-delays-and-disorders',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# How to help your child at home: everyday life is where children learn
WHO's Caregiver Skills Training programme teaches families to use everyday play, home activities and routines to help children with developmental delays or disabilities, including autism, to interact, take part, develop and learn. It covers communication, engagement, daily living skills, challenging behaviour and caregivers' own coping. It is designed for families of children aged about 2 to 9, and to be delivered by trained non-specialists such as nurses and community workers, with group sessions and home visits. An online version for caregivers is available through WHO Academy (WHO, Caregiver Skills Training).

# Early support helps
Timely, evidence-based psychosocial support can improve communication and social interaction, and support across life can improve development, health and wellbeing (WHO, Autism fact sheet).

# Look after yourself too
Caring for a child with extra needs can be demanding. Caregivers are often stigmatised, isolated and under financial strain, and many do not get the support they need (WHO). You deserve information and practical support as well (WHO). Parent groups and local organisations can help; the ANDA directory lists organisations across Africa.

# Sources
- WHO. Training for caregivers of children with developmental disabilities, including autism (Caregiver Skills Training). https://www.who.int/teams/mental-health-and-substance-use/treatment-care/who-caregivers-skills-training-for-families-of-children-with-developmental-delays-and-disorders
- WHO. Autism (fact sheet), 17 September 2025. https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-rights-stigma', 'Rights, stigma and safety', 'NeuRafiki, from WHO',
 'https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# Equal rights
Everyone, including autistic people, has the right to the highest attainable standard of physical and mental health (WHO). Support should be designed and delivered with the participation of the people it is for (WHO).

# Stigma and discrimination
Autistic people often face stigma and discrimination, including being unjustly denied health care, education and the chance to take part in their communities. Their families are often stigmatised and isolated too (WHO).

# Are autistic children dangerous?
No. Being autistic does not make a person dangerous. In fact, WHO reports that autistic people are more vulnerable to violence, injury and abuse, not less (WHO). Some children find noise, change or crowds very hard and may become distressed; that is a sign they need support and understanding, not punishment.

# Health and safety
Autistic people are more likely to have unmet health needs, are more vulnerable in emergencies, and often meet health workers who know little about autism (WHO). If anyone is in danger or being harmed, contact local emergency services or a helpline (https://findahelpline.com).

# Sources
- WHO. Autism (fact sheet), 17 September 2025. https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders
- WHO. Caregiver Skills Training. https://www.who.int/teams/mental-health-and-substance-use/treatment-care/who-caregivers-skills-training-for-families-of-children-with-developmental-delays-and-disorders$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)'),

('nr-co-occurring', 'Conditions that often occur together', 'NeuRafiki, from WHO, CDC, NIMH and NIDCD',
 'https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders',
 'NeuRafiki original text (our own words). Facts cited from the sources listed in the text.', 'en', 'written_summary',
$b$# More than one at once is common
- Autistic people often also have epilepsy, depression, anxiety or ADHD (WHO). Seizures, sleep and eating differences, stomach problems such as constipation, and anxiety are common alongside autism (CDC).
- ADHD often occurs with learning difficulties, sleep problems, anxiety, depression or behaviour difficulties (NIMH).
- Developmental language disorder raises the chance of reading, spelling and maths difficulties, and some children with DLD also show signs of dyslexia (NIDCD).
- A person can have more than one learning difficulty (NICHD).

# Why it matters
Because conditions overlap, and some, such as sleep problems, anxiety or hearing difficulties, can look like others, a full assessment by a qualified professional is important (CDC; NIDCD). Tell the professional about everything you have noticed, including sleep, eating, mood and any seizures. Seizures always need medical attention.

# Sources
- WHO. Autism (fact sheet), 17 September 2025. https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders
- CDC. Signs and Symptoms of Autism Spectrum Disorder. https://www.cdc.gov/autism/signs-symptoms/index.html
- CDC. Symptoms of ADHD. https://www.cdc.gov/adhd/signs-symptoms/index.html
- NIMH (NIH). Attention-Deficit/Hyperactivity Disorder (ADHD). https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd
- NIDCD (NIH). Developmental Language Disorder. https://www.nidcd.nih.gov/health/developmental-language-disorder
- NICHD (NIH). About Learning Disabilities. https://www.nichd.nih.gov/health/topics/learning/conditioninfo$b$,
 'Claude draft 2026-11-27 (WHO/CDC/NIH/research)')

on conflict (key) do nothing;

-- Level 1 test questions: each should find its source.
insert into public.kb_eval_cases (level, category, question, expected_source_key, created_by_label) values
  (1, 'retrieval', 'Is NeuRafiki a diagnosis?', 'nr-screening-vs-diagnosis', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Who can diagnose my child?', 'nr-screening-vs-diagnosis', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'What is autism?', 'nr-autism-what-is', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'How common is autism?', 'nr-autism-what-is', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'My 2 year old does not point or respond to his name. Is that a sign of autism?', 'nr-autism-signs-children', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'What are repetitive behaviours in autism?', 'nr-autism-signs-children', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'At what age can autism be diagnosed?', 'nr-autism-diagnosis', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Who does an autism evaluation?', 'nr-autism-diagnosis', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'I am 38 and think I might be autistic. Is it too late to get diagnosed?', 'nr-autism-adults', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'How can an adult get assessed for autism?', 'nr-autism-adults', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'What are the signs of ADHD in children?', 'nr-adhd-what-signs', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'What is the inattentive type of ADHD?', 'nr-adhd-what-signs', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Is there a test for ADHD?', 'nr-adhd-diagnosis', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Why do teachers need to fill in forms for an ADHD assessment?', 'nr-adhd-diagnosis', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Can adults have ADHD without knowing?', 'nr-adhd-adults', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'I am in my 40s, always restless and disorganised. Could it be ADHD?', 'nr-adhd-adults', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'What is dyslexia?', 'nr-learning-dyslexia', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'My child struggles with maths and numbers. What could that be?', 'nr-learning-dyslexia', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'What is developmental language disorder?', 'nr-dld-language', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Does speaking two languages at home cause language delay?', 'nr-dld-language', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'What is dyspraxia?', 'nr-dcd-dyspraxia', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'My child is very clumsy and finds handwriting and dressing hard. What could help?', 'nr-dcd-dyspraxia', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Do vaccines cause autism?', 'nr-myths-causes', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Is autism caused by bad parenting?', 'nr-myths-causes', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'What should I do after my child''s screening results?', 'nr-after-screening', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'How do I prepare for an appointment with a specialist?', 'nr-after-screening', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'How can I help my autistic child at home?', 'nr-support-home', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'I am exhausted caring for my child. Is there support for parents?', 'nr-support-home', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Do autistic people have rights to health care and education?', 'nr-rights-stigma', 'Claude draft 2026-11-27'),
  (1, 'retrieval', 'Can autistic children also have epilepsy or anxiety?', 'nr-co-occurring', 'Claude draft 2026-11-27')
on conflict (level, question) do nothing;
