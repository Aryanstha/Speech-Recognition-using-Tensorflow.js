let recognizer;
        let words;
        const wordList = ["zero","one","two","three","four","five","six","seven","eight","nine", "yes", "no", "up", "down", "left", "right", "stop", "go"];
        let modelLoaded = false;
        
        document.addEventListener('DOMContentLoaded', () => {
            const wrapperElement = document.getElementById('sp-cmd-wrapper');
            for (let word of wordList) {
                wrapperElement.innerHTML += `<div class='col-3 col-md-6'><div id='word-${word}' class='badge'>${word}</div></div>`;
            };
            
            document.getElementById("audio-switch").addEventListener('change', (event) => {
                if(event.target.checked) {
                    if(modelLoaded) {
                        startListening();
                    }else{
                        loadModel();
                    }
                } else {
                    stopListening();
                }   
            });
        });
        
        async function loadModel() { 
            // Show the loading element
            const loadingElement = document.getElementById('demo-loading');
            loadingElement.classList.remove('hidden');
            
            // When calling `create()`, you must provide the type of the audio input.
            // - BROWSER_FFT uses the browser's native Fourier transform.
            recognizer = speechCommands.create("BROWSER_FFT");  
            await recognizer.ensureModelLoaded()
            
            words = recognizer.wordLabels();
            modelLoaded = true;
            
            // Hide the loading element
            loadingElement.classList.add('hidden');
            startListening();
        }
        
        function startListening() {
            recognizer.listen(({scores}) => {
            
                // Everytime the model evaluates a result it will return the scores array
                // Based on this data we will build a new array with each word and it's corresponding score
                scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
                
                // After that we sort the array by scode descending
                scores.sort((s1, s2) => s2.score - s1.score);
                
                // And we highlight the word with the highest score
                const elementId = `word-${scores[0].word}`;
                document.getElementById(elementId).classList.add('active');
                
                // This is just for removing the highlight after 2.5 seconds
                setTimeout(() => {
                    document.getElementById(elementId).classList.remove('active');
                }, 2500);
            }, 
            {
                probabilityThreshold: 0.70
            });
        }
        
        function stopListening(){
            recognizer.stopListening();
        }
