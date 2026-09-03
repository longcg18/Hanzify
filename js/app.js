/**
 * HanziFlow 汉字流 - Core Client Application Logic
 * Interactive Chinese Homework & Instant Assessment Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    totalQuestions: 5,
    answers: {
      q1: null,            // 'A' | 'B' | 'C'
      q2: null,            // 'A' | 'B' | 'C' | 'D'
      q3: [],              // Array of selected word IDs
      q4_audioBlob: null,  // Recorded voice blob or simulated voice
      q5_photo: null       // Uploaded photo file or mock
    },
    audioPlaying: false,
    audioSpeed: 1.0,
    recording: false,
    recordingTimerInterval: null,
    recordingSeconds: 0,
    mediaRecorder: null,
    audioChunks: [],
    timerSecondsRemaining: 25 * 60 // 25:00 countdown timer
  };

  // Correct answer keys & explanations for auto-grading
  const correctAnswers = {
    q1: 'A', // 苹果多少钱一斤 -> 五块钱一斤 (5 tệ/cân)
    q2: 'A', // 东西 -> dōngxi (thanh nhẹ)
    q3: ['w1', 'w2', 'w3', 'w4'] // 这件衣服 + 有点儿 + 贵 + 。
  };

  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================
  const els = {
    // Progress
    answeredCount: document.getElementById('answeredCount'),
    totalQuestions: document.getElementById('totalQuestions'),
    progressPercentage: document.getElementById('progressPercentage'),
    progressBarFill: document.getElementById('progressBarFill'),
    dockDoneCount: document.getElementById('dockDoneCount'),
    dockTip: document.getElementById('dockTip'),
    timerBadge: document.getElementById('assignmentTimer'),

    // Q1: Audio Player
    btnPlay1: document.getElementById('btnPlay1'),
    playIcon1: document.getElementById('playIcon1'),
    waveVisualizer1: document.getElementById('waveVisualizer1'),
    audioCurrentTime: document.getElementById('audioCurrentTime'),
    audioDuration: document.getElementById('audioDuration'),
    speedBtns: document.querySelectorAll('.speed-btn'),
    optionsGroup1: document.getElementById('optionsGroup1'),

    // Q2: Pinyin Options
    optionsGroup2: document.getElementById('optionsGroup2'),

    // Q3: Sentence Builder
    sentenceDropZone: document.getElementById('sentenceDropZone'),
    dropPlaceholder: document.getElementById('dropPlaceholder'),
    wordPool: document.getElementById('wordPool'),
    btnResetSentence: document.getElementById('btnResetSentence'),

    // Q4: Voice Recorder
    btnSampleAudio: document.getElementById('btnSampleAudio'),
    recorderWidget: document.getElementById('recorderWidget'),
    recorderStatusText: document.getElementById('recorderStatusText'),
    micCanvas: document.getElementById('micCanvas'),
    recordingTimer: document.getElementById('recordingTimer'),
    btnToggleRecord: document.getElementById('btnToggleRecord'),
    recordIcon: document.getElementById('recordIcon'),
    recordBtnLabel: document.getElementById('recordBtnLabel'),
    playbackReview: document.getElementById('playbackReview'),
    recordedAudioElement: document.getElementById('recordedAudioElement'),
    btnRerecord: document.getElementById('btnRerecord'),

    // Q5: Photo Upload
    uploadZone: document.getElementById('uploadZone'),
    handwritingFileInput: document.getElementById('handwritingFileInput'),
    uploadDefaultUi: document.getElementById('uploadDefaultUi'),
    uploadPreviewUi: document.getElementById('uploadPreviewUi'),
    previewImage: document.getElementById('previewImage'),
    previewFilename: document.getElementById('previewFilename'),
    previewFilesize: document.getElementById('previewFilesize'),
    btnRemovePhoto: document.getElementById('btnRemovePhoto'),
    btnBrowseFile: document.getElementById('btnBrowseFile'),

    // Submission & Result Modal
    btnSubmitAssignment: document.getElementById('btnSubmitAssignment'),
    resultModal: document.getElementById('resultModal'),
    btnCloseModal: document.getElementById('btnCloseModal'),
    btnReviewAnswers: document.getElementById('btnReviewAnswers'),
    finalScoreVal: document.getElementById('finalScoreVal')
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  initTimer();
  setupAudioPlayer();
  setupQuestion1and2();
  setupSentenceBuilder();
  setupVoiceRecorder();
  setupPhotoUpload();
  setupSubmission();
  updateProgressUI();

  // ==========================================
  // 1. COUNTDOWN TIMER
  // ==========================================
  function initTimer() {
    setInterval(() => {
      if (state.timerSecondsRemaining > 0) {
        state.timerSecondsRemaining--;
        const mins = Math.floor(state.timerSecondsRemaining / 60).toString().padStart(2, '0');
        const secs = (state.timerSecondsRemaining % 60).toString().padStart(2, '0');
        els.timerBadge.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  }

  // ==========================================
  // 2. QUESTION 1: AUDIO PLAYER & OPTIONS
  // ==========================================
  function setupAudioPlayer() {
    let playInterval = null;
    let playbackSeconds = 0;
    const maxSeconds = 8;

    // Toggle Play/Pause
    els.btnPlay1.addEventListener('click', () => {
      if (state.audioPlaying) {
        stopAudioPlayback();
      } else {
        startAudioPlayback();
      }
    });

    // Speed Controls (1.0x, 0.8x)
    els.speedBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        els.speedBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.audioSpeed = parseFloat(e.target.dataset.speed) || 1.0;
      });
    });

    function startAudioPlayback() {
      state.audioPlaying = true;
      els.playIcon1.classList.remove('fa-play');
      els.playIcon1.classList.add('fa-pause');
      els.waveVisualizer1.classList.add('playing');

      // Speech Synthesis for authentic Chinese utterance
      speakChinese("苹果多少钱一斤？五块钱一斤。", state.audioSpeed);

      playbackSeconds = 0;
      clearInterval(playInterval);
      playInterval = setInterval(() => {
        playbackSeconds++;
        const s = playbackSeconds < 10 ? `0${playbackSeconds}` : playbackSeconds;
        els.audioCurrentTime.textContent = `00:${s}`;

        if (playbackSeconds >= maxSeconds) {
          stopAudioPlayback();
        }
      }, 1000 / state.audioSpeed);
    }

    function stopAudioPlayback() {
      state.audioPlaying = false;
      els.playIcon1.classList.remove('fa-pause');
      els.playIcon1.classList.add('fa-play');
      els.waveVisualizer1.classList.remove('playing');
      clearInterval(playInterval);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }

  // ==========================================
  // 3. QUESTION 1 & QUESTION 2: SELECTION LOGIC
  // ==========================================
  function setupQuestion1and2() {
    // Q1 Radio Change
    const q1Radios = document.querySelectorAll('input[name="q1_answer"]');
    q1Radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.answers.q1 = e.target.value;
        // Highlight chosen item
        document.querySelectorAll('#optionsGroup1 .option-item').forEach(item => item.classList.remove('selected'));
        e.target.closest('.option-item').classList.add('selected');
        markCardAnswered(1, true);
        updateProgressUI();
      });
    });

    // Q2 Radio Change
    const q2Radios = document.querySelectorAll('input[name="q2_answer"]');
    q2Radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.answers.q2 = e.target.value;
        // Highlight chosen item
        document.querySelectorAll('#optionsGroup2 .option-item').forEach(item => item.classList.remove('selected'));
        e.target.closest('.option-item').classList.add('selected');
        markCardAnswered(2, true);
        updateProgressUI();
      });
    });
  }

  // ==========================================
  // 4. QUESTION 3: SENTENCE BUILDER (WORD REORDERING)
  // ==========================================
  function setupSentenceBuilder() {
    const chips = els.wordPool.querySelectorAll('.word-chip');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const wordId = chip.dataset.wordId;
        const wordText = chip.dataset.word;

        // Move to drop zone
        chip.classList.add('used');
        state.answers.q3.push(wordId);

        // Create chip clone inside slot
        const slotChip = document.createElement('button');
        slotChip.type = 'button';
        slotChip.className = 'word-chip in-slot';
        slotChip.dataset.wordId = wordId;
        slotChip.innerHTML = chip.innerHTML;

        // Click slot chip to return back
        slotChip.addEventListener('click', () => {
          slotChip.remove();
          chip.classList.remove('used');
          state.answers.q3 = state.answers.q3.filter(id => id !== wordId);
          checkSentenceDropZoneState();
          updateProgressUI();
        });

        els.sentenceDropZone.appendChild(slotChip);
        checkSentenceDropZoneState();
        updateProgressUI();
      });
    });

    // Reset button
    els.btnResetSentence.addEventListener('click', () => {
      resetSentenceBuilder();
      updateProgressUI();
    });

    function checkSentenceDropZoneState() {
      const slotChips = els.sentenceDropZone.querySelectorAll('.word-chip.in-slot');
      if (slotChips.length > 0) {
        els.dropPlaceholder.style.display = 'none';
        els.sentenceDropZone.classList.add('filled');
      } else {
        els.dropPlaceholder.style.display = 'block';
        els.sentenceDropZone.classList.remove('filled');
      }

      const allPlaced = state.answers.q3.length === chips.length;
      markCardAnswered(3, allPlaced);
    }

    function resetSentenceBuilder() {
      state.answers.q3 = [];
      const slotChips = els.sentenceDropZone.querySelectorAll('.word-chip.in-slot');
      slotChips.forEach(c => c.remove());
      chips.forEach(c => c.classList.remove('used'));
      els.dropPlaceholder.style.display = 'block';
      els.sentenceDropZone.classList.remove('filled');
      markCardAnswered(3, false);
    }
  }

  // ==========================================
  // 5. QUESTION 4: VOICE RECORDER & SPEAKING
  // ==========================================
  function setupVoiceRecorder() {
    // Teacher Sample Speech
    els.btnSampleAudio.addEventListener('click', () => {
      speakChinese("太贵了，便宜一点儿吧！", 0.9);
    });

    // Record Button Click
    els.btnToggleRecord.addEventListener('click', () => {
      if (!state.recording) {
        startRecording();
      } else {
        stopRecording();
      }
    });

    // Re-record Button
    els.btnRerecord.addEventListener('click', () => {
      state.answers.q4_audioBlob = null;
      els.playbackReview.classList.add('hidden');
      els.recorderStatusText.textContent = "Sẵn sàng thu âm";
      markCardAnswered(4, false);
      updateProgressUI();
    });

    // Visualizer Canvas setup
    const canvas = els.micCanvas;
    const ctx = canvas.getContext('2d');
    let animId = null;

    function drawIdleVisualizer() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e2e8f0';
      const centerY = canvas.height / 2;
      ctx.fillRect(20, centerY - 1, canvas.width - 40, 2);
    }
    drawIdleVisualizer();

    function drawLiveWave() {
      if (!state.recording) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 24;
      const barWidth = 6;
      const gap = 6;
      const startX = (canvas.width - (bars * (barWidth + gap))) / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < bars; i++) {
        const height = Math.floor(Math.random() * 42) + 6;
        ctx.fillStyle = i % 2 === 0 ? '#e11d48' : '#fb7185';
        ctx.fillRect(startX + i * (barWidth + gap), centerY - height / 2, barWidth, height);
      }
      animId = requestAnimationFrame(drawLiveWave);
    }

    async function startRecording() {
      state.recording = true;
      state.recordingSeconds = 0;
      els.recorderWidget.classList.add('recording');
      els.recorderStatusText.textContent = "Đang thu âm giọng đọc...";
      els.recordIcon.classList.remove('fa-microphone');
      els.recordIcon.classList.add('fa-stop');
      els.recordBtnLabel.textContent = "Dừng & Nộp Thu Âm";
      els.playbackReview.classList.add('hidden');

      drawLiveWave();

      // Timer counter
      clearInterval(state.recordingTimerInterval);
      state.recordingTimerInterval = setInterval(() => {
        state.recordingSeconds++;
        const s = state.recordingSeconds < 10 ? `0${state.recordingSeconds}` : state.recordingSeconds;
        els.recordingTimer.textContent = `00:${s}`;
      }, 1000);

      // Attempt actual microphone access if supported
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          state.mediaRecorder = new MediaRecorder(stream);
          state.audioChunks = [];

          state.mediaRecorder.ondataavailable = (e) => {
            state.audioChunks.push(e.data);
          };

          state.mediaRecorder.onstop = () => {
            const blob = new Blob(state.audioChunks, { type: 'audio/webm' });
            state.answers.q4_audioBlob = blob;
            els.recordedAudioElement.src = URL.createObjectURL(blob);
            // Stop tracks
            stream.getTracks().forEach(track => track.stop());
          };

          state.mediaRecorder.start();
        } else {
          fallbackMockRecording();
        }
      } catch (err) {
        console.warn("Microphone access not granted or not supported, using simulated recorder:", err);
        fallbackMockRecording();
      }
    }

    function fallbackMockRecording() {
      state.answers.q4_audioBlob = new Blob(["mock-audio-data"], { type: 'audio/wav' });
      // Use sample audio speech synthesis fallback or empty audio preview
      els.recordedAudioElement.src = "https://actions.google.com/sounds/v1/speech/greeting_male.ogg";
    }

    function stopRecording() {
      state.recording = false;
      clearInterval(state.recordingTimerInterval);
      cancelAnimationFrame(animId);
      drawIdleVisualizer();

      els.recorderWidget.classList.remove('recording');
      els.recorderStatusText.textContent = "Đã hoàn thành bản thu";
      els.recordIcon.classList.remove('fa-stop');
      els.recordIcon.classList.add('fa-microphone');
      els.recordBtnLabel.textContent = "Bắt đầu Thu Âm";

      if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
        state.mediaRecorder.stop();
      } else {
        fallbackMockRecording();
      }

      els.playbackReview.classList.remove('hidden');
      markCardAnswered(4, true);
      updateProgressUI();
    }
  }

  // ==========================================
  // 6. QUESTION 5: HANDWRITING PHOTO UPLOAD
  // ==========================================
  function setupPhotoUpload() {
    // Click browse button or drop zone
    els.btnBrowseFile.addEventListener('click', (e) => {
      e.stopPropagation();
      els.handwritingFileInput.click();
    });

    els.uploadZone.addEventListener('click', () => {
      els.handwritingFileInput.click();
    });

    // File selected
    els.handwritingFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileChosen(file);
      }
    });

    // Drag & Drop
    els.uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      els.uploadZone.classList.add('dragover');
    });

    els.uploadZone.addEventListener('dragleave', () => {
      els.uploadZone.classList.remove('dragover');
    });

    els.uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      els.uploadZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleFileChosen(file);
      }
    });

    // Remove photo
    els.btnRemovePhoto.addEventListener('click', (e) => {
      e.stopPropagation();
      state.answers.q5_photo = null;
      els.handwritingFileInput.value = '';
      els.uploadPreviewUi.classList.add('hidden');
      els.uploadDefaultUi.classList.remove('hidden');
      markCardAnswered(5, false);
      updateProgressUI();
    });

    function handleFileChosen(file) {
      state.answers.q5_photo = file;
      els.previewFilename.textContent = file.name;
      els.previewFilesize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

      const reader = new FileReader();
      reader.onload = (event) => {
        els.previewImage.src = event.target.result;
        els.uploadDefaultUi.classList.add('hidden');
        els.uploadPreviewUi.classList.remove('hidden');
        markCardAnswered(5, true);
        updateProgressUI();
      };
      reader.readAsDataURL(file);
    }
  }

  // ==========================================
  // 7. PROGRESS TRACKER & CARD STATE
  // ==========================================
  function markCardAnswered(qid, isDone) {
    const card = document.getElementById(`qCard${qid}`);
    if (card) {
      if (isDone) {
        card.classList.add('answered');
      } else {
        card.classList.remove('answered');
      }
    }
  }

  function countAnswered() {
    let count = 0;
    if (state.answers.q1) count++;
    if (state.answers.q2) count++;
    if (state.answers.q3.length === 4) count++;
    if (state.answers.q4_audioBlob) count++;
    if (state.answers.q5_photo) count++;
    return count;
  }

  function updateProgressUI() {
    const count = countAnswered();
    const percent = Math.round((count / state.totalQuestions) * 100);

    els.answeredCount.textContent = count;
    els.progressPercentage.textContent = `${percent}%`;
    els.progressBarFill.style.width = `${percent}%`;

    els.dockDoneCount.textContent = count;
    if (count === state.totalQuestions) {
      els.dockTip.textContent = "Tuyệt vời! Bạn đã hoàn thành tất cả các phần.";
      els.dockTip.style.color = "#059669";
    } else {
      els.dockTip.textContent = `Còn ${state.totalQuestions - count} phần chưa làm xong`;
      els.dockTip.style.color = "#64748b";
    }
  }

  // ==========================================
  // 8. SUBMISSION & RESULT MODAL
  // ==========================================
  function setupSubmission() {
    els.btnSubmitAssignment.addEventListener('click', () => {
      const answered = countAnswered();
      if (answered < 3) {
        alert("Bạn ơi, hãy hoàn thành ít nhất các phần trắc nghiệm trước khi nộp bài nhé!");
        return;
      }

      // Calculate score for auto-graded objective questions
      let autoScore = 0;
      if (state.answers.q1 === correctAnswers.q1) autoScore += 2.0;
      if (state.answers.q2 === correctAnswers.q2) autoScore += 2.0;
      
      // Check sentence builder order
      const isQ3Correct = JSON.stringify(state.answers.q3) === JSON.stringify(correctAnswers.q3);
      if (isQ3Correct) autoScore += 2.0;

      // Update final score modal
      els.finalScoreVal.textContent = autoScore.toFixed(1);

      // Trigger Confetti Celebration 🎉
      if (window.confetti) {
        window.confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          window.confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          window.confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 300);
      }

      // Show Modal
      els.resultModal.classList.remove('hidden');
    });

    els.btnCloseModal.addEventListener('click', () => {
      els.resultModal.classList.add('hidden');
    });

    els.btnReviewAnswers.addEventListener('click', () => {
      els.resultModal.classList.add('hidden');
      highlightGradedReview();
    });
  }

  // Highlight correct and incorrect answers on the page for review
  function highlightGradedReview() {
    // Q1 Review
    const q1Items = document.querySelectorAll('#optionsGroup1 .option-item');
    q1Items.forEach(item => {
      const radio = item.querySelector('input');
      if (radio.value === correctAnswers.q1) {
        item.style.borderColor = "#059669";
        item.style.backgroundColor = "#ecfdf5";
      } else if (radio.checked) {
        item.style.borderColor = "#e11d48";
        item.style.backgroundColor = "#fff1f2";
      }
    });

    // Q2 Review
    const q2Items = document.querySelectorAll('#optionsGroup2 .option-item');
    q2Items.forEach(item => {
      const radio = item.querySelector('input');
      if (radio.value === correctAnswers.q2) {
        item.style.borderColor = "#059669";
        item.style.backgroundColor = "#ecfdf5";
      } else if (radio.checked) {
        item.style.borderColor = "#e11d48";
        item.style.backgroundColor = "#fff1f2";
      }
    });

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // UTILITY: SPEECH SYNTHESIS HELPER
  // ==========================================
  function speakChinese(text, speed = 1.0) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = speed;
      
      // Try to find natural Chinese voice
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('cmn'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }
});
