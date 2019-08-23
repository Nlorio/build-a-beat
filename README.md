# Build A Beat: https://nlorio.github.io/160_final/

I used reactJS for development. The microphone interaction and the ability to record and playback audio was the first feature to be designed and incorporated. This was done without any large libraries or packages.

After this, my focus shifted to audio detection. For feasibility, given the time constraints, I decided that at minimum our application should be able to detect four noises intrinsic to beatboxing. Once detected the application should record and playback the user created beat with the respective true sound of the noise (drums). It was during these preliminary attempts that I discovered the p5 Processing Library. P5 contains many useful features for audio processing, namely for frequency spectrum and amplitude analysis.
The application was redesigned using some of the functionality of the p5 library.

I employed various techniques to detect the sounds made by users as input to the microphone. Ultimately I decided it was best to detect the audio and build the beat on the go as data was streamed into the microphone by the user. The user is also given the option to playback their beat. Ultimately a significant amount of pre processing had to be done to get the audio detection functioning properly. We recorded small sound files of each potential user input noise and carried out our preprocessing analysis on these noises to build scores.

The application builds scores of the microphone audio stream for each of the four sounds, the sound that receives the highest score is assumed to be the intended noise and is therefore added to the beat. The average amplitude was used to ensure that a certain threshold was reached before scoring should take place.

## Method 1 — Key Characteristics Analysis

I analyzed the key, defining characteristics of each potential user input. I then visually inspected the peak amplitude frequency spectrum of each noise using Audacity and the p5 library. From this I determined that the centroid of the frequency spectrum was the most significantly distinguishable characteristic between the four noises. I surmised that it may be sufficient for our audio detection. These features were used to determine the score of the audio stream for each respective sound.


## Method 2 — Least Squares Vector Analysis

The second approach involved comparing the entire spectrum of each potential user input.
I built a pre processing function which takes in a user input sample sound and outputs the frequency spectrum at its highest amplitude point. The frequency of the spectrum from the microphone audio stream is compared with the comparison spectrums returned by the pre processing function to compute a score. I used a least squared sum to compare the similarity of the spectrum arrays. The noise that receives the highest score / has the highest similarity is played out loud and simultaneously added to our playback beat for later use. A score is only assigned and a beat is only added if its amplitude is greater than the average background noise. The final product employed method 2 for audio detection.


Finally, I added some touch-ups, interactivity, and buttons to the application. Users may stop/start recording/transforming their beat. Users can play back their newly built beat. Users may clear their created beat to start again. Users may furthermore export their beat for later use in larger audio processing applications such as Logic.


Feel free to checkout the github page: https://github.com/Nlorio/BuildABeat.git
View the live application here! https://nlorio.github.io/BuildABeat/

All pre processing functions are carried out when the web page is instantiated so it may take several seconds before loading is complete and the app is ready to use. Enjoy!
