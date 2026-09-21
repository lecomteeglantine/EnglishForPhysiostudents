const TOPICS = [
  {id:'body', name:'Body & regions', icon:'🧍', desc:'Body regions and orientation used in assessment.'},
  {id:'skeleton', name:'Skeleton & bones', icon:'🦴', desc:'Common and scientific names for major bones.'},
  {id:'joints', name:'Joints & movement', icon:'↔️', desc:'Joint actions and movement terminology.'},
  {id:'muscles', name:'Muscles & soft tissue', icon:'💪', desc:'Muscles, tendons, ligaments and soft tissue.'},
  {id:'respiratory', name:'Respiratory tract', icon:'🫁', desc:'Breathing anatomy and respiratory vocabulary.'},
  {id:'circulatory', name:'Blood vessels & circulation', icon:'🫀', desc:'Core cardiovascular vocabulary for clinical English.'},
  {id:'digestive', name:'Digestive & abdominal', icon:'🩻', desc:'Digestive anatomy and abdominal regions.'},
  {id:'symptoms', name:'Symptoms & injury', icon:'🩹', desc:'Pain, injury and common patient complaints.'},
  {id:'assessment', name:'Assessment & function', icon:'📏', desc:'Movement, function, posture, gait and measurement.'},
  {id:'rehab', name:'Rehabilitation & equipment', icon:'🩼', desc:'Exercises, aids and rehabilitation instructions.'}
];

const VOCAB = [
  {id:'trunk',topic:'body',term:'trunk',fr:'tronc',definition:'The central part of the body, excluding the head and limbs.',example:'Ask the patient to rotate the trunk slowly.',level:'A2–B1',visual:'body'},
  {id:'upper-limb',topic:'body',term:'upper limb',fr:'membre supérieur',definition:'The arm and all structures from the shoulder to the hand.',example:'Compare strength in the left and right upper limbs.',level:'B1',visual:'body'},
  {id:'lower-limb',topic:'body',term:'lower limb',fr:'membre inférieur',definition:'The leg and all structures from the hip to the foot.',example:'The patient reports weakness in the right lower limb.',level:'B1',visual:'body'},
  {id:'thorax',topic:'body',term:'thorax',fr:'thorax',definition:'The part of the trunk between the neck and the abdomen.',example:'Observe the movement of the thorax during breathing.',level:'B1',visual:'body'},
  {id:'pelvis',topic:'body',term:'pelvis',fr:'bassin',definition:'The bony structure at the base of the trunk that connects the spine to the lower limbs.',example:'Check whether the pelvis remains level during single-leg stance.',level:'B1',visual:'body'},
  {id:'distal',topic:'body',term:'distal',fr:'distal / éloigné du tronc',definition:'Further away from the centre of the body or from the point of attachment.',example:'The pain is more distal, close to the wrist.',level:'B1–B2',visual:'body'},

  {id:'skull',topic:'skeleton',term:'skull / cranium',fr:'crâne',definition:'The bony structure of the head that protects the brain.',example:'The cervical spine supports the skull.',level:'A2–B1',visual:'skeleton'},
  {id:'clavicle',topic:'skeleton',term:'collarbone / clavicle',fr:'clavicule',definition:'A long bone that connects the sternum to the shoulder blade.',example:'Palpate the clavicle and compare both sides.',level:'B1',visual:'skeleton'},
  {id:'scapula',topic:'skeleton',term:'shoulder blade / scapula',fr:'omoplate / scapula',definition:'A flat triangular bone on the back of the shoulder.',example:'Observe scapular movement during arm elevation.',level:'B1',visual:'skeleton'},
  {id:'sternum',topic:'skeleton',term:'breastbone / sternum',fr:'sternum',definition:'The flat bone in the centre of the chest to which the ribs attach.',example:'The ribs connect to the sternum at the front of the chest.',level:'B1',visual:'skeleton'},
  {id:'femur',topic:'skeleton',term:'thigh bone / femur',fr:'fémur',definition:'The long bone of the thigh and the longest bone in the body.',example:'The femur forms part of both the hip and knee joints.',level:'B1',visual:'skeleton'},
  {id:'patella',topic:'skeleton',term:'kneecap / patella',fr:'rotule / patella',definition:'A small bone at the front of the knee that protects the joint and improves leverage.',example:'Patellar mobility may be assessed after knee surgery.',level:'B1',visual:'skeleton'},

  {id:'flexion',topic:'joints',term:'flexion',fr:'flexion',definition:'A movement that usually decreases the angle between two body segments.',example:'Measure active knee flexion with a goniometer.',level:'B1',visual:'joint'},
  {id:'extension',topic:'joints',term:'extension',fr:'extension',definition:'A movement that usually increases the angle between two body segments.',example:'Full knee extension is important for normal gait.',level:'B1',visual:'joint'},
  {id:'abduction',topic:'joints',term:'abduction',fr:'abduction',definition:'Movement of a body part away from the midline.',example:'Shoulder abduction is limited to 90 degrees today.',level:'B1',visual:'joint'},
  {id:'adduction',topic:'joints',term:'adduction',fr:'adduction',definition:'Movement of a body part towards the midline.',example:'Ask the patient to perform hip adduction against resistance.',level:'B1',visual:'joint'},
  {id:'rotation',topic:'joints',term:'rotation',fr:'rotation',definition:'Movement of a body part around its longitudinal axis.',example:'Cervical rotation is painful on the left.',level:'B1',visual:'joint'},
  {id:'dorsiflexion',topic:'joints',term:'dorsiflexion',fr:'flexion dorsale',definition:'Movement at the ankle that brings the top of the foot towards the shin.',example:'Reduced ankle dorsiflexion can affect walking and squatting.',level:'B1–B2',visual:'joint'},

  {id:'tendon',topic:'muscles',term:'tendon',fr:'tendon',definition:'A strong band of connective tissue that attaches muscle to bone.',example:'The Achilles tendon connects the calf muscles to the heel.',level:'B1',visual:'muscle'},
  {id:'ligament',topic:'muscles',term:'ligament',fr:'ligament',definition:'A strong band of connective tissue that connects bone to bone around a joint.',example:'The anterior cruciate ligament helps stabilise the knee.',level:'B1',visual:'muscle'},
  {id:'quadriceps',topic:'muscles',term:'quadriceps',fr:'quadriceps',definition:'A group of four muscles at the front of the thigh that extend the knee.',example:'Quadriceps strengthening is part of the rehabilitation programme.',level:'B1',visual:'muscle'},
  {id:'hamstrings',topic:'muscles',term:'hamstrings',fr:'ischio-jambiers',definition:'A group of muscles at the back of the thigh that flex the knee and extend the hip.',example:'The hamstrings feel tight during straight-leg raise.',level:'B1',visual:'muscle'},
  {id:'calf',topic:'muscles',term:'calf muscles',fr:'muscles du mollet',definition:'The muscles at the back of the lower leg, especially gastrocnemius and soleus.',example:'The patient performs calf raises for strength and balance.',level:'A2–B1',visual:'muscle'},
  {id:'rotator-cuff',topic:'muscles',term:'rotator cuff',fr:'coiffe des rotateurs',definition:'A group of four shoulder muscles and their tendons that stabilise the shoulder joint.',example:'Rotator cuff weakness can make overhead movement difficult.',level:'B1–B2',visual:'muscle'},

  {id:'airway',topic:'respiratory',term:'airway',fr:'voie respiratoire',definition:'A passage through which air moves into and out of the lungs.',example:'Keep the airway clear and observe the patient’s breathing.',level:'B1',visual:'lungs'},
  {id:'trachea',topic:'respiratory',term:'trachea / windpipe',fr:'trachée',definition:'The tube that carries air from the throat towards the lungs.',example:'The trachea divides into the main bronchi.',level:'B1',visual:'lungs'},
  {id:'bronchi',topic:'respiratory',term:'bronchi',fr:'bronches',definition:'The two main air passages that branch from the trachea into the lungs.',example:'The bronchi divide into smaller airways inside the lungs.',level:'B1',visual:'lungs'},
  {id:'diaphragm',topic:'respiratory',term:'diaphragm',fr:'diaphragme',definition:'The main muscle of breathing, located below the lungs.',example:'Diaphragmatic breathing can reduce excessive upper-chest breathing.',level:'B1',visual:'lungs'},
  {id:'inhalation',topic:'respiratory',term:'inhalation',fr:'inspiration',definition:'The act of breathing air into the lungs.',example:'During inhalation, the diaphragm contracts and moves down.',level:'B1',visual:'lungs'},
  {id:'exhalation',topic:'respiratory',term:'exhalation',fr:'expiration',definition:'The act of breathing air out of the lungs.',example:'Ask for a slow, relaxed exhalation.',level:'B1',visual:'lungs'},

  {id:'artery',topic:'circulatory',term:'artery',fr:'artère',definition:'A blood vessel that carries blood away from the heart.',example:'The radial artery can be used to check the pulse.',level:'B1',visual:'vessel'},
  {id:'vein',topic:'circulatory',term:'vein',fr:'veine',definition:'A blood vessel that carries blood towards the heart.',example:'Visible veins may become more prominent after exercise.',level:'B1',visual:'vessel'},
  {id:'capillary',topic:'circulatory',term:'capillary',fr:'capillaire',definition:'A very small blood vessel where gases and nutrients are exchanged with tissues.',example:'Capillaries connect the arterial and venous systems.',level:'B1–B2',visual:'vessel'},
  {id:'pulse',topic:'circulatory',term:'pulse',fr:'pouls',definition:'The rhythmic expansion of an artery caused by each heartbeat.',example:'Check the pulse before and after the exercise test.',level:'A2–B1',visual:'vessel'},
  {id:'blood-pressure',topic:'circulatory',term:'blood pressure',fr:'pression artérielle / tension',definition:'The pressure of circulating blood against the walls of the arteries.',example:'Measure blood pressure before mobilisation if indicated.',level:'B1',visual:'vessel'},
  {id:'circulation',topic:'circulatory',term:'circulation',fr:'circulation sanguine',definition:'The continuous movement of blood through the heart, blood vessels and tissues.',example:'Ankle pumps can help promote lower-limb circulation.',level:'B1',visual:'vessel'},

  {id:'oesophagus',topic:'digestive',term:'oesophagus',fr:'œsophage',definition:'The muscular tube that carries food from the throat to the stomach.',example:'The oesophagus passes through the diaphragm before reaching the stomach.',level:'B1',visual:'digestive'},
  {id:'stomach',topic:'digestive',term:'stomach',fr:'estomac',definition:'A muscular organ that receives and breaks down food after swallowing.',example:'The stomach is mainly located in the upper left abdomen.',level:'A2–B1',visual:'digestive'},
  {id:'small-intestine',topic:'digestive',term:'small intestine',fr:'intestin grêle',definition:'The long part of the digestive tract where most nutrient absorption occurs.',example:'The small intestine lies mainly in the central and lower abdomen.',level:'B1',visual:'digestive'},
  {id:'large-intestine',topic:'digestive',term:'large intestine / colon',fr:'gros intestin / côlon',definition:'The final major part of the digestive tract, where water is absorbed and stool is formed.',example:'The colon surrounds much of the small intestine.',level:'B1',visual:'digestive'},
  {id:'liver',topic:'digestive',term:'liver',fr:'foie',definition:'A large organ in the upper right abdomen with many metabolic and digestive functions.',example:'The liver lies mainly under the right side of the diaphragm.',level:'A2–B1',visual:'digestive'},
  {id:'abdominal-quadrants',topic:'digestive',term:'abdominal quadrants',fr:'quadrants abdominaux',definition:'Four clinical regions used to describe the location of abdominal structures or symptoms.',example:'Document the pain location using the abdominal quadrants.',level:'B1–B2',visual:'digestive'},

  {id:'sprain',topic:'symptoms',term:'sprain',fr:'entorse',definition:'An injury in which a ligament is stretched or torn.',example:'The patient sustained an ankle sprain during sport.',level:'B1',visual:'injury'},
  {id:'strain',topic:'symptoms',term:'strain',fr:'élongation / lésion musculaire',definition:'An injury involving a muscle or tendon that has been overstretched or torn.',example:'A hamstring strain can cause sudden posterior thigh pain.',level:'B1',visual:'injury'},
  {id:'swelling',topic:'symptoms',term:'swelling / oedema',fr:'gonflement / œdème',definition:'An increase in size caused by fluid accumulation or inflammation in tissues.',example:'There is mild swelling around the ankle.',level:'B1',visual:'injury'},
  {id:'stiffness',topic:'symptoms',term:'stiffness',fr:'raideur',definition:'Difficulty moving a joint or body part freely, often with reduced range of motion.',example:'Morning stiffness lasts for about twenty minutes.',level:'B1',visual:'injury'},
  {id:'numbness',topic:'symptoms',term:'numbness',fr:'engourdissement / perte de sensibilité',definition:'Reduced or absent sensation in part of the body.',example:'Ask whether the patient has numbness in the fingers.',level:'B1',visual:'injury'},
  {id:'tingling',topic:'symptoms',term:'tingling',fr:'fourmillements',definition:'A pins-and-needles sensation in the skin.',example:'Tingling travels from the neck into the hand.',level:'B1',visual:'injury'},

  {id:'rom',topic:'assessment',term:'range of motion',fr:'amplitude articulaire',definition:'The amount of movement available at a joint, often measured in degrees.',example:'Active range of motion is limited by pain.',level:'B1',visual:'assessment'},
  {id:'gait',topic:'assessment',term:'gait',fr:'marche / schéma de marche',definition:'The pattern or manner in which a person walks.',example:'Observe gait speed, step length and symmetry.',level:'B1',visual:'assessment'},
  {id:'balance',topic:'assessment',term:'balance',fr:'équilibre',definition:'The ability to maintain the body’s centre of mass over its base of support.',example:'Static balance is good, but dynamic balance is reduced.',level:'B1',visual:'assessment'},
  {id:'posture',topic:'assessment',term:'posture',fr:'posture',definition:'The position and alignment of the body when sitting, standing or moving.',example:'Assess posture in standing from the front, side and back.',level:'B1',visual:'assessment'},
  {id:'strength',topic:'assessment',term:'muscle strength',fr:'force musculaire',definition:'The ability of a muscle or muscle group to generate force.',example:'Compare hip abductor strength on both sides.',level:'B1',visual:'assessment'},
  {id:'mobility',topic:'assessment',term:'mobility',fr:'mobilité',definition:'The ability to move safely and effectively, with or without assistance.',example:'Her bed mobility is independent, but stair mobility is limited.',level:'B1',visual:'assessment'},

  {id:'crutches',topic:'rehab',term:'crutches',fr:'béquilles',definition:'Walking aids that transfer some body weight through the hands and arms.',example:'Adjust the crutches so the handgrips are at wrist level.',level:'A2–B1',visual:'rehab'},
  {id:'walking-frame',topic:'rehab',term:'walking frame / walker',fr:'déambulateur',definition:'A four-point walking aid that provides a wide base of support.',example:'The patient practises transfers with a walking frame.',level:'B1',visual:'rehab'},
  {id:'resistance-band',topic:'rehab',term:'resistance band',fr:'élastique de résistance',definition:'An elastic exercise band used to provide graded resistance during movement.',example:'Use a light resistance band for shoulder external rotation.',level:'B1',visual:'rehab'},
  {id:'weight-bearing',topic:'rehab',term:'weight-bearing',fr:'mise en charge / appui',definition:'The amount of body weight that is allowed or placed through a limb.',example:'The patient is allowed partial weight-bearing on the operated leg.',level:'B1–B2',visual:'rehab'},
  {id:'exercise-prescription',topic:'rehab',term:'exercise prescription',fr:'prescription d’exercices',definition:'A planned programme that specifies the type, dose and progression of exercise.',example:'The exercise prescription includes strength, balance and walking practice.',level:'B1–B2',visual:'rehab'},
  {id:'home-exercise',topic:'rehab',term:'home exercise programme',fr:'programme d’exercices à domicile',definition:'A set of exercises a patient is asked to complete independently between appointments.',example:'Review the home exercise programme at the next session.',level:'B1',visual:'rehab'}
];

const GRAMMAR = [
  {
    id:'questions', title:'Question forms for assessment', level:'A2–B1', icon:'❓',
    focus:'Build clear yes/no and WH- questions for patient history and assessment.',
    videoId:'j9b1CNN_rFU', videoTitle:'Asking Questions – 6 Minute Grammar · BBC Learning English',
    rules:[
      '<strong>Be</strong>: Be + subject → “Are you comfortable?”',
      '<strong>Other verbs</strong>: Do/Does + subject + base verb → “Does it hurt when you walk?”',
      '<strong>Past</strong>: Did + subject + base verb → “When did the pain start?”',
      '<strong>WH- word</strong> comes first → “Where do you feel the pain?”'
    ],
    examples:['Do you use a walking aid at home?','How long have you had this pain?','Which movement makes it worse?','Were you able to climb stairs before the injury?'],
    quiz:[
      {q:'Choose the correct assessment question.',opts:['Where you feel the pain?','Where do you feel the pain?','Where does you feel the pain?'],a:1,why:'Use WH-word + do + subject + base verb.'},
      {q:'Complete: ___ the swelling start yesterday?',opts:['Did','Does','Has'],a:0,why:'A finished past time (“yesterday”) takes past simple: Did + base verb.'},
      {q:'Choose the correct form.',opts:['Are you able to stand without support?','Do you able to stand without support?','Can you able to stand without support?'],a:0,why:'With the adjective “able”, use the verb be.'},
      {q:'Complete: How long ___ you had these symptoms?',opts:['did','have','are'],a:1,why:'“How long” with a situation continuing to now often uses present perfect.'}
    ]
  },
  {
    id:'present', title:'Present Simple vs Present Continuous', level:'A2–B1', icon:'⏱️',
    focus:'Separate routines and facts from what is happening now.',
    videoId:'xFsYrTIndhI', videoTitle:'Present Simple and Present Continuous – 6 Minute Grammar · BBC Learning English',
    rules:[
      '<strong>Present Simple</strong> for routines, facts and repeated actions.',
      '<strong>Present Continuous</strong> for actions happening now or temporary situations.',
      'Remember third-person <strong>-s</strong>: “She walks with a stick.”',
      'Use <strong>be + verb-ing</strong>: “She is walking in the corridor now.”'
    ],
    examples:['He exercises three times a week.','Today he is practising stairs with the physiotherapist.','The knee flexes and extends.','The patient is improving this week.'],
    quiz:[
      {q:'The patient usually ___ with a walking frame.',opts:['walks','is walking','walk'],a:0,why:'“Usually” describes a routine, so use present simple.'},
      {q:'Look: she ___ without the crutches now.',opts:['walks','is walking','walked'],a:1,why:'The action is happening now, so use present continuous.'},
      {q:'Choose the correct sentence.',opts:['The quadriceps extend the knee.','The quadriceps are extend the knee.','The quadriceps extending the knee.'],a:0,why:'This is an anatomical fact, so use present simple.'},
      {q:'This week, we ___ on balance and stair practice.',opts:['focus','are focusing','focused usually'],a:1,why:'A temporary current programme can use present continuous.'}
    ]
  },
  {
    id:'pastperfect', title:'Past Simple vs Present Perfect', level:'B1', icon:'🕰️',
    focus:'Describe patient history, previous events and change up to the present.',
    videoId:'jwmKjgwlMk8', videoTitle:'Present perfect and past simple – 6 Minute Grammar · BBC Learning English',
    rules:[
      '<strong>Past Simple</strong> for completed events at a finished time: yesterday, last week, in 2025.',
      '<strong>Present Perfect</strong> for experience or change connected to now.',
      'Present Perfect: <strong>have/has + past participle</strong>.',
      'Do not use a finished past-time expression with the present perfect.'
    ],
    examples:['She fell two weeks ago.','She has improved since the first session.','Have you ever used crutches before?','The pain increased yesterday evening.'],
    quiz:[
      {q:'The patient ___ her ankle last Saturday.',opts:['has sprained','sprained','has sprain'],a:1,why:'“Last Saturday” is a finished past time.'},
      {q:'Her balance ___ since the first session.',opts:['improved yesterday','has improved','did improve since'],a:1,why:'“Since” links a past starting point to the present.'},
      {q:'Choose the best question.',opts:['Have you ever had physiotherapy before?','Did you ever have physiotherapy before in your life?','Have you had physiotherapy last year?'],a:0,why:'Present perfect is natural for life experience without a finished time.'},
      {q:'We ___ the walking aid at the appointment yesterday.',opts:['have adjusted','adjusted','have adjust'],a:1,why:'“Yesterday” requires past simple.'}
    ]
  },
  {
    id:'modals', title:'Modals & imperatives for instructions', level:'B1', icon:'🗣️',
    focus:'Give safe, clear exercise instructions, advice and obligations.',
    videoId:'HUXXgVElADg', videoTitle:'Have to and must – 6 Minute Grammar · BBC Learning English',
    rules:[
      '<strong>Imperative</strong> for direct instructions: “Keep your knee over your foot.”',
      '<strong>Should</strong> for advice: “You should stop if you feel sharp pain.”',
      '<strong>Must / have to</strong> for strong necessity or rules.',
      '<strong>Mustn’t</strong> means prohibition; <strong>don’t have to</strong> means no necessity.'
    ],
    examples:['Breathe out as you stand up.','You should perform this exercise slowly.','You must use the handrail today.','You don’t have to do all ten repetitions if you are tired.'],
    quiz:[
      {q:'Choose the clearest exercise instruction.',opts:['You bending your knee.','Bend your knee slowly.','To bend knee slowly.'],a:1,why:'The imperative uses the base verb and is clear for step-by-step instructions.'},
      {q:'You ___ stop the exercise if you feel sudden chest pain.',opts:['must','don’t have to','might not'],a:0,why:'“Must” expresses strong necessity in a safety instruction.'},
      {q:'“You don’t have to use the crutches indoors” means…',opts:['Using them is forbidden.','Using them is optional.','You must use them.'],a:1,why:'“Don’t have to” means there is no obligation.'},
      {q:'For general advice, choose the best option: You ___ keep active within your limits.',opts:['should','mustn’t','did'],a:0,why:'“Should” is appropriate for general advice.'}
    ]
  },
  {
    id:'comparatives', title:'Comparatives for progress & function', level:'B1', icon:'📈',
    focus:'Compare pain, strength, movement, speed and progress.',
    videoId:'U2DxNgQqDgQ', videoTitle:'Comparatives and superlatives – 6 Minute Grammar · BBC Learning English',
    rules:[
      'Short adjectives: <strong>-er</strong> → stronger, faster.',
      'Long adjectives: <strong>more + adjective</strong> → more stable, more comfortable.',
      'Use <strong>than</strong> to compare two things.',
      'Irregular: good → better; bad → worse; far → further/farther.'
    ],
    examples:['Her gait is faster than last week.','The left ankle is less stable than the right.','This exercise is more demanding than the previous one.','Pain is better today.'],
    quiz:[
      {q:'Today the patient is walking ___ than yesterday.',opts:['more fast','faster','fastest'],a:1,why:'“Fast” takes the comparative “faster”.'},
      {q:'The second exercise is ___ demanding than the first.',opts:['more','most','much'],a:0,why:'Long adjectives usually take “more”.'},
      {q:'Choose the correct sentence.',opts:['Her balance is better than last week.','Her balance is more good than last week.','Her balance is best than last week.'],a:0,why:'“Good” has the irregular comparative “better”.'},
      {q:'The painful side is ___ stable.',opts:['less','least than','more less'],a:0,why:'“Less + adjective” expresses a lower degree.'}
    ]
  },
  {
    id:'passive', title:'Passive voice for procedures', level:'B1–B2', icon:'📝',
    focus:'Describe procedures and clinical processes when the action matters more than the doer.',
    videoId:'38QqDrckyxM', videoTitle:'Active and passive voice – 6 Minute Grammar · BBC Learning English',
    rules:[
      'Passive = <strong>be + past participle</strong>.',
      'Present: “Range of motion <strong>is measured</strong> with a goniometer.”',
      'Past: “The patient <strong>was assessed</strong> yesterday.”',
      'Use <strong>by</strong> only when the doer is important.'
    ],
    examples:['Blood pressure is checked before the exercise test.','The walking frame was adjusted to the patient’s height.','The exercise is repeated ten times.','The patient was referred by the consultant.'],
    quiz:[
      {q:'Choose the correct passive sentence.',opts:['Range of motion measures with a goniometer.','Range of motion is measured with a goniometer.','Range of motion is measure with a goniometer.'],a:1,why:'Passive voice needs be + past participle.'},
      {q:'Yesterday, the patient ___ by the physiotherapist.',opts:['was assessed','is assessed','assessed'],a:0,why:'Past passive = was/were + past participle.'},
      {q:'The crutches ___ to the correct height before use.',opts:['should adjust','should be adjusted','should be adjust'],a:1,why:'Modal passive = modal + be + past participle.'},
      {q:'Which sentence focuses on the procedure rather than the clinician?',opts:['The therapist measured the pulse.','The pulse was measured before exercise.','The therapist was measuring the pulse.'],a:1,why:'The passive foregrounds the procedure/result.'}
    ]
  },
  {
    id:'conditionals', title:'Zero & first conditionals for safety', level:'B1', icon:'⚠️',
    focus:'Explain predictable effects and what to do if a future situation occurs.',
    videoId:'K-MKAjvvcsw', videoTitle:'Zero and first conditional – 6 Minute Grammar · BBC Learning English',
    rules:[
      '<strong>Zero conditional</strong>: If + present, present → general consequence or routine instruction.',
      '<strong>First conditional</strong>: If + present, will + base verb → realistic future possibility.',
      'Do not normally put <strong>will</strong> in the if-clause.',
      'In clinical instructions, imperatives can follow the if-clause: “If you feel dizzy, sit down.”'
    ],
    examples:['If the pain increases, stop the exercise.','If you practise regularly, your confidence will improve.','If the knee is swollen, range of motion may be reduced.','If you feel unsteady, use the handrail.'],
    quiz:[
      {q:'Choose the correct safety instruction.',opts:['If you will feel dizzy, sit down.','If you feel dizzy, sit down.','If you felt dizzy, will sit down.'],a:1,why:'Use present simple in the if-clause for a real condition.'},
      {q:'If she practises the stairs every day, she ___ more confident.',opts:['will become','becomes yesterday','will became'],a:0,why:'First conditional: present in the if-clause + will + base verb.'},
      {q:'Which sentence describes a general consequence?',opts:['If a joint is immobilised for a long time, it can become stiff.','If the joint will be immobilised, it can stiff.','If a joint was immobilised tomorrow, it stiffens.'],a:0,why:'Zero conditional is useful for general cause-and-effect relationships.'},
      {q:'Complete: If the exercise ___ sharp pain, stop.',opts:['causes','will cause','cause'],a:0,why:'The if-clause takes present simple.'}
    ]
  }
];

const CLINICAL_CASES = [
  {icon:'🦵',area:'Musculoskeletal',title:'Post-op knee rehabilitation',difficulty:'B1',brief:'A 67-year-old patient is three weeks after total knee replacement. Flexion is limited, quadriceps strength is reduced and stair confidence is low.',tasks:['Identify 6 useful terms from the site.','Write 4 assessment questions.','Give 3 safe exercise instructions using imperatives or modals.','Compare today with the previous session using two comparatives.']},
  {icon:'🩼',area:'Mobility',title:'First day with crutches',difficulty:'A2–B1',brief:'A university student has an ankle sprain and has been told to use crutches with partial weight-bearing for one week.',tasks:['Explain how to adjust and use the crutches.','Ask about pain, swelling and numbness.','Give one warning using an if-clause.','Write a short home-exercise reminder.']},
  {icon:'🫁',area:'Respiratory',title:'Breathlessness after hospitalisation',difficulty:'B1',brief:'A patient reports shortness of breath on walking after a prolonged hospital stay. Lower-limb strength and endurance are reduced.',tasks:['Select 5 respiratory or assessment terms.','Ask questions about breathlessness and activity.','Give paced-breathing instructions.','Describe one procedure using the passive voice.']},
  {icon:'🧠',area:'Neurological',title:'Gait and balance after stroke',difficulty:'B1–B2',brief:'A patient has reduced right lower-limb strength, slower gait and difficulty changing direction after a stroke.',tasks:['Describe the gait using precise vocabulary.','Compare the two sides of the body.','Give three balance instructions.','Write a concise handover sentence.']},
  {icon:'🏃',area:'Sports',title:'Hamstring return to running',difficulty:'B1',brief:'A recreational runner is recovering from a hamstring strain. Walking is pain-free but sprinting still causes discomfort.',tasks:['Clarify the pain with four questions.','Use present perfect to describe progress.','Compare current capacity with pre-injury level.','Give a conditional return-to-running instruction.']},
  {icon:'🧍',area:'Back pain',title:'Desk worker with low back pain',difficulty:'B1',brief:'A desk worker reports stiffness after long sitting and pain when bending. No numbness or tingling is reported.',tasks:['Ask about aggravating and easing factors.','Explain posture without blaming the patient.','Give two movement-break instructions.','Use present simple for a daily routine plan.']}
];

const COMMUNICATION = [
  {icon:'🗂️',title:'Subjective assessment',lines:['What brings you in today?','When did the symptoms start?','Where exactly do you feel it?','What makes it better or worse?','How does this affect your daily activities?']},
  {icon:'📏',title:'Objective assessment',lines:['I’m going to check your range of motion.','Let me compare both sides.','Tell me if this movement reproduces your symptoms.','Try to hold this position against my hand.','I’ll assess your walking now.']},
  {icon:'🧘',title:'Exercise instructions',lines:['Keep your back relaxed.','Bend your knee slowly, then straighten it.','Breathe out as you stand up.','Do not push into sharp pain.','Aim for eight to ten controlled repetitions.']},
  {icon:'💬',title:'Patient-friendly explanations',lines:['This means the joint is a little stiff at the moment.','The aim is to restore movement gradually.','You may notice some muscle fatigue; that is different from sharp pain.','We’ll progress the exercise as your control improves.','The goal is to make everyday movement easier and safer.']},
  {icon:'🤝',title:'Handover',lines:['The main issue is reduced right knee flexion.','The patient is independently mobile with crutches.','Pain has improved since the previous session.','No numbness or tingling has been reported.','The next step is to progress strength and stair practice.']},
  {icon:'📝',title:'Clinical notes',lines:['Reports intermittent pain on stair descent.','Observed reduced stance time on the right.','Active knee flexion measured at 95 degrees.','Exercise programme reviewed and progressed.','Plan: reassess gait and stair tolerance next session.']}
];
