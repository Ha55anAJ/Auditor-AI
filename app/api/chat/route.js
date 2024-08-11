// import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
// import OpenAI from "openai" // Import OpenAI library for interacting with the OpenAI API
// import { Stream } from 'openai/streaming'

// // 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

// // System prompt for the AI, providing guidelines on how to respond to users
// // const systemPrompt = "Whats good ma ninja!"// Use your own system prompt here

// //Openrouter API key
// // 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

// //OpenAI API key
// // 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

// // POST function to handle incoming requests
// export async function POST(req) {
//   // const openai = new OpenAI(); // Create a new instance of the OpenAI client
//   const data = await req.json() // Parse the JSON body of the incoming request

//   const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: "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",
//     defaultHeaders: {
//     }
//   })
//   async function main() {
//     const completion = await openai.chat.completions.create({
//       model: "meta-llama/llama-3.1-8b-instruct:free",
//       messages: [
//         { role: "user", content: "Say this is a test" }
//       ],
//     })
  
//     console.log(completion.choices[0].message)
//   }

//   return new NextResponse(completion.choices[0].message) // Return the stream as the response
// }

import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = "You are an AI assistant called Auditor helping users with sleep, stress management or other mental health concerns. You should provide information on these topics when users ask about them. You must be polite and respectful and avoid providing medical advice. You can also provide general information on sleep and stress management.";

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
    defaultHeaders: {
      'Content-Type': 'application/json'
    }
  }); // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'meta-llama/llama-3.1-8b-instruct:free', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}


// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: "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",
//   defaultHeaders: {
//     'Content-Type': 'application/json'
//   }
// });

// const systemPrompt = "You are an AI assistant called Auditor helping users with sleep and stress management. You should provide information on these topics when users ask about them. You must be polite and respectful and avoid providing medical advice. You can also provide general information on sleep and stress management.";


// meta-llama/llama-3.1-8b-instruct:free

// import {NextResponse} from 'next/server';
// import OpenAI from 'openai';

// const systemPrompt = "You are an AI assistant called Auditor helping users with sleep and stress management. You should provide information on these topics when users ask about them. You must be polite and respectful and avoid providing medical advice. You can also provide general information on sleep and stress management.";

// const hubermanData = [
//   { 
//     keyword: 'sleep', 
//     content: 'Our light viewing behavior has perhaps the strongest effect on our levels of alertness and our capacity to fall asleep and get a good night’s sleep because at the fundamental layer of our biology, every cell in our body needs information about the time of day; it’s no coincidence that we have a collection of neurons over the roof of our mouth, the so-called suprachiasmatic nucleus, that’s our central circadian clock which informs every cell in our body about the time of day, but it is deep in our brain and has no access to light, so there are a collection of neurons in the eye, the so-called melanopsin ganglion cells or sometimes called intrinsically photosensitive ganglion cells, which are just neurons in the back of your eye, remembering of course that the eye is actually part of the brain that’s outside the skull, and those neurons communicate to the central clock when it’s daytime and when it’s night; the simple behavior that I do believe everybody should adopt, including many blind people we can talk about why that is, is to view ideally sunlight for two to ten minutes every morning upon waking so when you get up in the morning you really want to get bright light into your eyes because it does two things: first of all it triggers the timed release of cortisol, a healthy level of cortisol into your system which acts as a wake-up signal and will promote wakefulness and the ability to focus throughout the day, it also starts a timer for the onset of melatonin, this sleepiness hormone or the hormone of darkness as they say, melatonin is inhibited by light, so by viewing light first thing in the day you set in motion these two timers, one for wakefulness that starts immediately and one for sleepiness that starts later; the key thing here is that people are hearing a lot nowadays about avoiding blue light, blue light is so terrible, well it turns out that blue light is exactly the wavelength of light that triggers activation of these cells and that’s exactly what you want early in the day, so people generally will say well maybe I should just look at my computer or my phone first thing in the day well it turns out that these cells are very hard to activate early in the day and very easy to activate at night so it’s kind of like the biology is encouraging us if you will to take on the right behaviors which are to get outside even if there’s cloud cover there’s a lot more light energy a lot more photons coming through cloud cover than you’re going to get off your phone or a computer and early in the day two to ten minutes outside without sunglasses is going to be really beneficial for a huge range of biological functions and brain state I have made a practice I’m in the middle of nowhere in the country right now of of getting up and not necessarily doing a full workout but just jumping rope for literally two to five minutes two to ten minutes outside facing the sun where the sun is perfect and there’s certainly an effect I mean I am moving so there’s an effect on cortisol and as you noted it’s like cortisol gets this ridiculously bad rap across the board and it’s like guys if you don’t have cortisol you’re dead so exactly if you like having storing glycogen and breaking it down into glucose and so on you it’s important to have some cortisol there’s a tremendous for me mood elevating effect of this exposure and I’m just I really have never familiarized myself with the mechanism by which that would be the case and certainly if it’s placebo I’m happy to just take placebo but do you have any explanation for why that exposure can have such a mood elevating effect yeah it’s definitely not placebo that morning light exposure is going to also trigger the activation of dopamine release you know dopamine being this essentially feel good neuromodulator the best way to conceptualize dopamine is that yes it’s part of the reward system but it’s really the molecule of motivation and positive anticipation that’s really what it’s about and I should mention that the cortisol is going to be released in a pulse once every 24 hours no matter what that’s coming as we call it’s an intrinsic rhythm but you can time it by viewing light and or by getting exercise early in the day there are actually data to just kind of emphasize what happens when you don’t do this there are really nice data from my colleague david spiegel’s lab he actually co-published this with the great bob sapolsky a few years ago david’s our associate chair of psychiatry at stanford and they showed that if that cortisol pulse shows up later in the day and especially if it’s around 8 or 9 pm then it’s associated with depression by shifting that cortisol pulse earlier in the day you ameliorate some of the symptoms of depression and because of the dopamine release you get this overall mood enhancement there are four things that really time our circadian biology and these mood mechanisms properly and align us for sleep and they the most powerful time keeper as they say zeitgeber because Germans discovered this mechanism initially so the most powerful time keeper that’s there it is I knew you’d do it better than I would is is light when you view light and light is the most powerful stimulus for your biology and central circadian clock then it’s exercise so it’s your protocol of jumping rope facing the sun you’re layering on time keepers you’re giving more signals to the central clock and the rest of your body about when to be active and you’re also indirectly signaling when you will want to be asleep later then it’s feeding I know a lot of people fast through the early part of the day now that’s very fashionable and I do that as well but were you to eat early in the day that can also help and then the other one is social cues so interacting with people early in the day or with your dog early in the day I have a dog live alone with my dog so that’s how I interact with the world socially but those things are going to create wake up signals and your body will start to anticipate them and your brain will start to anticipate them such that if you miss it for a day you’re still going to wake up and feel that alertness signal early in the day so this is not something that you have to do every day but ideally you do it every day because it’s like setting a clock or a watch properly and I should mention that for people that live in areas with very dense cloud cover you can use light boxes and things of that sort but irrespective of that in the morning and during the day and anytime you want to be alert you want to flip on as many overhead lights as possible this is because these cells in the eye that trigger activation and alertness of the rest of the brain and nervous system reside in the lower portion of the eye they view the upper visual field now the inverse of all this is also important as you approach the evening or night time and you want to go to sleep that is a time to start avoiding bright lights of any color not just blue light and if possible to place whatever lights are present in your environment lower in your visual field so this would be desk lamps most people don’t have floor lighting dim the lights if you want to wear blue blockers or do something of that sort that’s fine but i think people have taken the blue blocker thing a little too far by wearing them all day that’s actually going to disrupt your circadian clocks so in the evening you really want to avoid bright light of any kind and again it’s an averaging if you do this every once in a while you go to the bathroom middle of the night or you have an emergency and things are really bright for one night it’s not going to screw you up however there was a paper published in the journal cell a few years ago by my good friend and colleague at the national institutes of mental health his name is samuel hattar he’s the head of the chronobiology unit at the national institutes of mental health and what sammer’s lab showed is that bright light exposure of any wavelength between the hours of 11 pm and 4 am cause a serious disruption in the dopamine system such that in subsequent days you have a disruption in a lowering of mood difficulty in learning there’s a cascade of things that happen in other words we get punished for light viewing at the wrong times of the circadian cycle and we get rewarded for light viewing at the correct times of the circadian cycle.' 
//   },
//   {
//     keyword: 'neuroplasticity',
//     content: 'Dr. Andrew Huberman discusses how neuroplasticity can be enhanced through specific types of visual experiences and light exposure, explaining the underlying neurological mechanisms.'
//   },
//   {
//      keyword: 'stress', 
//      content: 'I think most people have heard that mindfulness, meditation, and exercise are good for us and we all need to be getting enough sleep, but life happens. We are very alert, we’re very sleepy, it is very hard to use these so-called top-down mechanisms of intention and gratitude, but it’s very clear that the physiological ‘sigh’ is the fastest, hard-wired way for us to eliminate this stressful response in our body quickly in real time. It turns out you’re all doing this all the time, but you are doing it involuntarily, and when you stress, you tend to forget that you can also activate these systems voluntarily. This is an extremely powerful set of techniques that we know from scientific studies that are being done in my lab, Jack Feldman’s Lab at UCLA, and others that are very useful for reducing your stress response in real time, and here’s how they work: as far as I am aware, the best tools to reduce stress quickly, so-called real-time tools, are going to be tools that have a direct line to the so-called autonomic nervous system, the autonomic nervous system is a name given to the kind of general features of alertness or calmness in the body, typically it means automatic, although we do have some control over it, certain so-called levers or entry points, and the tool that, at least to my knowledge, is the fastest and most thoroughly grounded in physiology neuroscience for calming down in a self-directed way is what’s called the physiological sigh. These days there seems to be a lot of interest in breath work, breath work typically is when you go and you sit down or you lie down and you deliberately breathe in a particular way for a series of minutes in order to shift your physiology access some states and it does have some utility that we’re going to talk about, that is not what I’m talking about now, what I’m talking about when I refer to physiological sighs is the very real medical school textbook relationship between the brain, the body and the heart. Let’s take the hallmark of the stress response: the heart starts beating faster, blood is shuttled to the big muscles of the body to move you away from whatever it is the stressor is or just make you feel like you need to move or talk, your face goes flushed, etc., heart rate many of us feel is involuntary just kind of functions whether or not we’re moving fast or moving slow, if you think about it, it’s not really purely autonomic because you can speed up your heart rate by running or you can slow it down by slowing down but that’s indirect control. There is however a way in which you can breathe that directly controls your heart rate through the interactions between the sympathetic and the parasympathetic nervous system, here’s how it works: when you inhale, so whether or not it’s through the nose or through the mouth, this skeletal muscle that’s inside your body called the diaphragm, it moves down and that’s because the lungs expand, the diaphragm moves down your heart actually gets a little bit bigger in that expanded space, there’s more space for the heart and as a consequence whatever blood is in there is now at a lower volume, we’re moving a little bit more slowly in that larger volume than it was before you inhaled, okay, so more space, heart gets bigger, blood moves more slowly and there’s a little group of neurons called the sinoatrial node in the heart that registers, it’s believe it or not those neurons pay attention to the rate of blood flow through the heart and send a signal up to the brain that blood is moving more slowly through the heart, the brain then sends a signal back to the heart to speed the heart up, so what this means is if you want your heart to beat faster, inhale longer, inhale more vigorously than your exhales. Now there are a variety of ways that one could do that, but it doesn’t matter if it’s through the nose or through the mouth, if your inhales are longer than your exhales, you’re speeding up your heart. Now the opposite is also true, if you want to slow your heart rate down so stress response hits you want to slow your heart rate down, what you want to do is again capitalize on this relationship between the body the meaning the diaphragm and the heart and the brain, here’s how it works: when you exhale the diaphragm moves up which makes the heart a little bit smaller, it actually gets a little more compact, blood flows more quickly through that compact space sort of like just a pipe getting smaller, the sinoatrial node registers that blood is going more quickly, sends a signal up to the brain and the parasympathetic nervous system, some neurons in your brain stem send a signal back to the heart to slow the heart down so if you want to calm down quickly you need to make your exhales longer and or more vigorous than your inhales, now the reason this is so attractive as a tool for controlling stress is that it works in real time, this doesn’t involve a practice that you have to go and sit there and do anything separate from life and we are going to get to emotion, emotions and stress happen in real time and so while it’s wonderful to have a breath work practice or to have the opportunity to get a massage or sit in a sauna or do whatever it is that you do in order to set your stress controls in the right direction, having tools that you can reach to in real time that require no learning I mean I had to teach it to you, you had to learn that but it doesn’t require any plasticity to activate these pathways so if you’re feeling stressed you still need to inhale of course but you need to lengthen your exhales, now there’s a tool that capitalizes on this in a kind of unique way, a kind of a twist, which is the physiological sigh, the physiological sigh was discovered in the ‘30s it’s now been explored at the neurobiological level and mechanistically in far more detail by Jack Feldman’s Lab at UCLA also Mark Krasnow’s Lab at Stanford and the physiological sigh is something that humans and animals do anytime they are about to fall asleep, you also do it throughout sleep from time to time when carbon dioxide which we’ll talk about in a moment builds up too much in your system and the physiological sigh is something that people naturally start doing when they’ve been crying and they’re trying to recover some air or calm down when they’ve been sobbing very hard or when they are in claustrophobic environments, however the amazing thing about this thing that we call the diaphragm, the skeletal muscle, is that it’s an internal organ that you can control voluntarily unlike your spleen or your heart or your pancreas where you can’t just say oh I want to make my pancreas turn out a little more insulin right now I’m just going to do that with my mind directly you can’t do that you could do that by smelling a really good donut or something but you can’t just do it directly you can move your diaphragm intentionally right you can do it anytime you want and it’ll run in the background if you’re not thinking about it, so this incredible pathway that goes from brain to diaphragm through what’s called the phrenic nerve, phrenic the phrenic nerve innervates the diaphragm you control anytime you want you can double up your inhales or triple up your inhales you can exhale more than your inhales whatever you want to do such an incredible organ and the physiological sigh is something that we do spontaneously but when you’re feeling stressed you can do a double inhale long exhale now I just told you a minute ago that if you inhale more than you exhale you’re going to speed the heart rate up which would promote more stress and activation now I’m telling you to do a double inhale exhale in order to calm down and the reason is the double inhale exhale which is the physiological sigh and takes advantage of the fact that when we do a double inhale even if the second inhale is sneaking in just a tiny bit more air because it’s kind of hard to get two deep inhales back to back you do big deep inhale and then another little one sneaking it in the little sacks in your lungs if you only have the lungs your lungs aren’t just two big bags but you’ve got millions of little sacks throughout the lungs that actually make the surface area of your lungs as big as a tennis court it’s amazing if we just spread that out what those tend to collapse as we get stressed and carbon dioxide builds up in our bloodstream and that’s one of the reasons we feel agitated as well so and it makes us very jittery I mean there’s some other effects of carbon dioxide I want to get into but when you do the double inhale exhale the double inhale reinflates those little sacks of the lungs and then when you do the long exhale that long exhale is now much more effective at ridding your body and bloodstream of carbon dioxide which relaxes you very quickly my lab in collaboration with David Spiegel’s lab David’s the associate chair of Psychiatry at Stanford are doing a study right now exploring how physiological sighs and other patterns of breathing done deliberately can modulate the stress response and other things related to emotionality those work are ongoing I want to be clear those studies aren’t done but it’s very clear from work in our Labs from working Jack Feldman’s lab and others that the physiological sigh is the fastest hard-wired way for us to eliminate this stressful response in our body quickly in real time and so I’m excited to give you this tool because I think most people have heard that mindfulness and meditation is good, exercise is good for us, we all need to be getting enough sleep, etc.,' 
//   },
// ];

// const retrieveHubermanContent = (query) => {
//   if (!query) return "";
//   return hubermanData
//     .filter(doc => query.toLowerCase().includes(doc.keyword))
//     .map(doc => doc.content)
//     .join(' \n');
// };

// export async function POST(req) {
//   const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: "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",
//     defaultHeaders: {
//       'Content-Type': 'application/json'
//     }
//   });
//   const data = await req.json();
//   const userQuery = data.query || "";
//   const hubermanContent = retrieveHubermanContent(userQuery);
//   const fullPrompt = `${systemPrompt} \n\n${hubermanContent} \n\nUser: ${userQuery}`;

//   try {
//     const completion = await openai.chat.completions.create({
//       messages: [{role: 'system', content: fullPrompt}],
//       model: 'meta-llama/llama-3.1-8b-instruct:free',
//     });

//     // Create a ReadableStream to handle the streaming response
//     const stream = new ReadableStream({
//       async start(controller) {
//         const encoder = new TextEncoder();
//         try {
//           // Simulate streaming chunks; modify this according to your actual API support
//           const chunks = typeof completion === 'string' ? [completion] : completion.choices.map(choice => choice.message.content);
//           for (const chunk of chunks) {
//             const text = encoder.encode(chunk); // Encode the content to Uint8Array
//             controller.enqueue(text); // Enqueue the encoded text to the stream
//           }
//         } catch (err) {
//           controller.error(err); // Handle any errors that occur during streaming
//         } finally {
//           controller.close(); // Close the stream when done
//         }
//       },
//     });

//     return new NextResponse(stream, { headers: { 'Content-Type': 'text/plain' }}); // Return the stream as the response
//   } catch (error) {
//     console.error('Error:', error);
//     return new NextResponse(JSON.stringify({ response: "Internal server error" }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }