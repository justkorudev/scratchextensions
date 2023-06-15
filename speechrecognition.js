class SpeechRecognitionBlock {
  constructor(runtime) {
    this.runtime = runtime;
    this.recognition = null;
    this.transcript = "";
  }

  getInfo() {
    return {
      id: "VoicetoText",
      name: "Speech Recognition",
      blocks: [
        {
          opcode: "startRecognition",
          blockType: "command",
          text: "Start speech recognition on [LANGUAGE] language",
          arguments: {
            LANGUAGE: {
              type: "string",
              menu: "languageMenu"
            }
          }
        },
        {
          opcode: "clearRecognition",
          blockType: "command",
          text: "Clear speech recognition",
        },
        {
          opcode: "getTranscript",
          blockType: "reporter",
          text: "Speech recognition",
        },
      ],
      menus: {
        languageMenu: {
          acceptReporters: true,
          items: ["es-ES", "en-US", "fr-FR"],
          values: ["es-ES", "en-US", "fr-FR"],
          selectedValue: "es-ES"
        }
      }
    };
  }

  startRecognition(args) {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    if (!this.recognition) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = args.LANGUAGE;
      this.recognition.interimResults = true;
      this.recognition.onresult = (event) => {
        // clear transcript
        this.transcript = '';
        let newTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            if (!this.transcript.includes(transcript)) {
              newTranscript += transcript;
              this.transcript += transcript;
              this.recognition.stop();
              this.recognition = null;
            }
          }
        }
      };
      this.recognition.start();
    }
  }

  clearRecognition() {
    this.transcript = "";
  }

  getTranscript() {
    const tempTranscript = this.transcript;
    return tempTranscript;
  }
}

Scratch.extensions.register(new SpeechRecognitionBlock());
