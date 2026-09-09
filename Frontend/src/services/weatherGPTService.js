export const sendMessageToGPT = async (message, context = {}) => {
  const { language = 'en', lat, lng } = context;

  // Mock POST request to our future LLM backend
  /*
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, latitude: lat, longitude: lng })
  });
  return response.json();
  */

  // Simulated AI delay
  return new Promise((resolve) => {
    setTimeout(() => {
      let reply = "";
      
      const msg = message.toLowerCase();
      
      if (msg.includes("flood")) {
        reply = language === 'hi'
          ? "बाढ़ का जोखिम अधिक है। निचले इलाकों में रहने वाले लोगों को तुरंत ऊंचे स्थानों पर जाने की सलाह दी जाती है।"
          : language === 'or'
          ? "ବନ୍ୟା ବିପଦ ଅଧିକ ଅଛି। ତଳିଆ ଅଞ୍ଚଳରେ ଥିବା ଲୋକମାନେ ତୁରନ୍ତ ଉଚ୍ଚ ସ୍ଥାନକୁ ଯାଆନ୍ତୁ।"
          : "High flood risk detected in low-lying zones. Water accumulation is expected. Move to higher ground if instructed by local authorities.";
      }
      else if (msg.includes("rain")) {
        reply = language === 'hi' 
          ? "आपके चयनित स्थान पर कल दोपहर में बारिश होने की संभावना है। सबसे अधिक संभावना दोपहर 2 बजे से शाम 6 बजे के बीच है।"
          : language === 'or'
          ? "ଆସନ୍ତାକାଲି ଅପରାହ୍ନରେ ଆପଣଙ୍କ ବଛାଯାଇଥିବା ସ୍ଥାନରେ ବର୍ଷା ହେବାର ସମ୍ଭାବନା ଅଛି।"
          : "Rainfall is likely in your selected location tomorrow afternoon. The highest probability is between 2 PM and 6 PM.";
      } 
      else if (msg.includes("lightning")) {
        reply = language === 'hi'
          ? "आपके स्थान से 15 किमी दूर मध्यम बिजली गतिविधि का पता चला है। कृपया घर के अंदर रहें।"
          : language === 'or'
          ? "ଆପଣଙ୍କ ସ୍ଥାନଠାରୁ ୧୫ କିମି ଦୂରରେ ବିଜୁଳି ଘଡ଼ଘଡ଼ି ଚିହ୍ନଟ ହୋଇଛି। ଦୟାକରି ଘର ଭିତରେ ରୁହନ୍ତୁ।"
          : "There is moderate lightning activity detected 15km from your location. Please remain indoors until the storm clears.";
      }
      else if (msg.includes("cyclone")) {
        reply = language === 'hi'
          ? "चक्रवात दाना वर्तमान में 400 किमी दूर है और तट की ओर बढ़ रहा है। कृपया अनुमानित पथ के लिए प्रभाव मानचित्र देखें।"
          : language === 'or'
          ? "ବାତ୍ୟା ଦାନା ବର୍ତ୍ତମାନ ୪୦୦ କିମି ଦୂରରେ ଅଛି ଏବଂ ଉପକୂଳ ଆଡ଼କୁ ଗତି କରୁଛି। ଦୟାକରି ମାନଚିତ୍ର ଦେଖନ୍ତୁ।"
          : "Cyclone Dana is currently 400km offshore and moving towards the coast. Check the Impact Map for real-time track prediction.";
      }
      else if (msg.includes("shelter") || msg.includes("safe place") || msg.includes("emergency")) {
        reply = language === 'hi'
          ? "निकटतम राहत आश्रय 2.4 किमी दूर सामुदायिक केंद्र में स्थित है। आपातकालीन हेल्पलाइन 112 या 1077 पर संपर्क करें।"
          : language === 'or'
          ? "ନିକଟତମ ଆଶ୍ରୟସ୍ଥଳୀ ୨.୪ କିମି ଦୂର କମ୍ୟୁନିଟି ସେଣ୍ଟରରେ ଅଛି। ହେଲ୍ପଲାଇନ୍ ୧୧୨ କିମ୍ବା ୧୦୭୭ ରେ ଯୋଗାଯୋଗ କରନ୍ତୁ।"
          : "The nearest relief shelter is located at the Community Center 2.4km away. Emergency response lines are available at 112 and 1077.";
      }
      else if (msg.includes("travel") || msg.includes("safe")) {
        reply = language === 'hi'
          ? "सड़क पर जलजमाव के कारण गैर-जरूरी यात्रा से बचें। मुख्य राजमार्ग खुले हैं लेकिन सतर्कता बरतें।"
          : language === 'or'
          ? "ଜଳବନ୍ଦୀ ଯୋଗୁଁ ଅନାବଶ୍ୟକ ଯାତ୍ରାରୁ ଦୂରେଇ ରୁହନ୍ତୁ। ମୁଖ୍ୟ ରାସ୍ତା ଖୋଲା ଅଛି।"
          : "Exercise caution. Low-lying arterial roads are experiencing water accumulation. Non-essential travel is discouraged during peak storm hours.";
      }
      else if (msg.includes("temp") || msg.includes("temperature")) {
        reply = language === 'hi'
          ? "वर्तमान तापमान 29°C है, जो 84% आर्द्रता के साथ 33°C जैसा महसूस होता है।"
          : language === 'or'
          ? "ବର୍ତ୍ତମାନ ତାପମାତ୍ରା ୨୯°C ଅଟେ।"
          : "Current temperature is 29°C, feels like 33°C with 84% relative humidity.";
      }
      else {
        reply = language === 'hi'
          ? "मैं WeatherGPT हूँ। मैं आपके स्थान के मौसम, वर्षा, बिजली, चक्रवात, बाढ़ और आपातकालीन सुरक्षा से जुड़े सभी सवालों के जवाब दे सकता हूँ।"
          : language === 'or'
          ? "ମୁଁ WeatherGPT। ମୁଁ ଆପଣଙ୍କୁ ପାଣିପାଗ, ବର୍ଷା, ବନ୍ୟା ଏବଂ ସୁରକ୍ଷା ପରାମର୍ଶ ବିଷୟରେ ସୂଚନା ଦେଇପାରିବି।"
          : "I am WeatherGPT. I can help you monitor weather forecasts, rainfall intensity, lightning strikes, cyclone systems, and flood advisories for your area.";
      }

      resolve({ reply });
    }, 800);
  });
};
