document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const form = document.getElementById('exam-form');
    const generateBtn = document.getElementById('generate-btn');
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoader = document.getElementById('btn-loader');
    const inputSection = document.getElementById('input-section');
    const resultsSection = document.getElementById('results-section');
    const displayTime = document.getElementById('display-time');
    
    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // UI Containers
    const timelineContainer = document.getElementById('timeline-container');
    const skipContainer = document.getElementById('skip-container');
    const notesContainer = document.getElementById('notes-container');
    const formulasContainer = document.getElementById('formulas-container');
    const cheatSheetContainer = document.getElementById('cheat-sheet-container');
    const quizContainer = document.getElementById('quiz-container');
    
    // Quiz Elements
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const quizResults = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score-display');
    const scoreMessage = document.getElementById('score-message');
    const retryBtn = document.getElementById('retry-btn');
    const reallocateBtn = document.getElementById('reallocate-btn');
    const reallocateLoader = document.getElementById('reallocate-loader');
    
    // ROI Table
    const roiTableBody = document.getElementById('roi-table-body');
    
    // File Upload Elements
    const notesInput = document.getElementById('notes-upload');
    const notesList = document.getElementById('notes-list');
    const pyqInput = document.getElementById('pyq-upload');
    const pyqList = document.getElementById('pyq-list');

    function handleFileInput(input, listElement) {
        input.addEventListener('change', () => {
            listElement.innerHTML = '';
            Array.from(input.files).forEach(file => {
                const span = document.createElement('span');
                span.className = 'file-item';
                span.textContent = file.name;
                listElement.appendChild(span);
            });
        });
    }

    handleFileInput(notesInput, notesList);
    handleFileInput(pyqInput, pyqList);

    let currentQuizData = [];

    // --- Tab Switching Logic ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });

    // --- Form Submission ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courseMaterial = document.getElementById('course-material').value;
        const examDate = document.getElementById('exam-date').value;
        const availableTime = document.getElementById('available-time').value;
        const apiKey = document.getElementById('api-key').value;
        const notesFiles = notesInput.files;
        const pyqFiles = pyqInput.files;

        if ((!courseMaterial && notesFiles.length === 0) || !availableTime || !apiKey) {
            alert('Please provide some syllabus text or upload notes, and fill all required fields.');
            return;
        }

        setLoading(true);

        try {
            const fileParts = await processFiles(notesFiles, pyqFiles);
            const data = await generateExamPlan(apiKey, courseMaterial, examDate, availableTime, fileParts);
            
            // Render all sections
            renderROI(data.roiAnalysis);
            renderTimeline(data.timeline);
            renderSkip(data.skipForNow);
            renderMarkdown(notesContainer, data.shortNotes);
            renderMarkdown(formulasContainer, data.formulasAndPyqs);
            renderMarkdown(cheatSheetContainer, data.fiveMinSheet);
            renderQuiz(data.quiz);
            
            // Show Results
            inputSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            displayTime.textContent = document.getElementById('available-time').options[document.getElementById('available-time').selectedIndex].text;
            
        } catch (error) {
            console.error(error);
            alert(`Error generating plan: ${error.message}`);
        } finally {
            setLoading(false);
        }
    });

    // --- File Processing ---
    async function processFiles(notesFiles, pyqFiles) {
        const parts = [];
        
        for (const file of notesFiles) {
            const base64Data = await readFileAsBase64(file);
            parts.push({ text: `[FILE: COURSE NOTES - ${file.name}]` });
            parts.push({
                inlineData: { data: base64Data, mimeType: file.type || 'application/octet-stream' }
            });
        }
        
        for (const file of pyqFiles) {
            const base64Data = await readFileAsBase64(file);
            parts.push({ text: `[FILE: PREVIOUS YEAR PAPERS - ${file.name}]` });
            parts.push({
                inlineData: { data: base64Data, mimeType: file.type || 'application/octet-stream' }
            });
        }
        
        return parts;
    }

    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // --- Gemini API Integration (DEMO MODE) ---
    async function generateExamPlan(apiKey, material, date, timeStr, fileParts = []) {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 1500));
        
        return {
          "roiAnalysis": [
            { "topic": "CPU Scheduling", "importance": "High", "difficulty": "Medium", "timeNeededMins": 25, "roiScore": 9.2 },
            { "topic": "Deadlocks", "importance": "High", "difficulty": "Medium", "timeNeededMins": 20, "roiScore": 8.5 },
            { "topic": "Paging", "importance": "High", "difficulty": "Hard", "timeNeededMins": 45, "roiScore": 6.8 },
            { "topic": "File Systems", "importance": "Medium", "difficulty": "Easy", "timeNeededMins": 15, "roiScore": 5.1 }
          ],
          "timeline": [
            {
              "timeLabel": "0:00-0:25",
              "priority": "MUST KNOW",
              "title": "CPU Scheduling Algorithms",
              "content": "- FCFS, SJF, Round Robin\n- Gantt Charts for average waiting time\n- Preemptive vs Non-Preemptive"
            },
            {
              "timeLabel": "0:25-0:45",
              "priority": "MUST KNOW",
              "title": "Deadlock Handling",
              "content": "- 4 Necessary conditions for Deadlock\n- Banker's Algorithm (Crucial for numericals)\n- Deadlock prevention vs avoidance"
            },
            {
              "timeLabel": "0:45-1:00",
              "priority": "QUICK REVISION",
              "title": "File Systems",
              "content": "- Contiguous vs Linked Allocation\n- Inodes basics"
            }
          ],
          "skipForNow": [
            {
              "topic": "Deep Paging & Virtual Memory",
              "reason": "Requires 45+ minutes. ROI is too low for the current available time. Focus on Deadlocks instead."
            }
          ],
          "shortNotes": "### CPU Scheduling\n- **SJF** is optimal but hard to implement.\n- **Round Robin** depends heavily on time quantum.\n\n### Deadlocks\n- **Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait**.\n- Banker's Algo uses `Need = Max - Allocation`.",
          "formulasAndPyqs": "### Banker's Algorithm Formula\n`Need[i, j] = Max[i, j] - Allocation[i, j]`\n\n### Likely PYQs:\n1. Find average turnaround time using Round Robin (Quantum=2).\n2. Is the given system state safe? (Banker's)",
          "fiveMinSheet": "- **SJF**: Shortest Job First\n- **RR**: Round Robin\n- **Deadlock**: Needs 4 conditions simultaneously.\n- **Banker's**: Safety algorithm.",
          "quiz": [
            { "topic": "CPU Scheduling", "question": "Which scheduling algorithm is non-preemptive by definition?", "options": ["Round Robin", "FCFS", "SRTF", "Multilevel Queue"], "answerIndex": 1 },
            { "topic": "Deadlocks", "question": "Which of the following is NOT a necessary condition for deadlock?", "options": ["Mutual Exclusion", "Circular Wait", "Preemption", "Hold and Wait"], "answerIndex": 2 },
            { "topic": "Paging", "question": "What does a page table map?", "options": ["Physical to Logical address", "Logical to Physical address", "Secondary to Primary memory", "None of the above"], "answerIndex": 1 },
            { "topic": "File Systems", "question": "Which allocation method suffers from external fragmentation?", "options": ["Contiguous", "Linked", "Indexed", "Both A and C"], "answerIndex": 0 },
            { "topic": "CPU Scheduling", "question": "Time quantum is defined in:", "options": ["SJF", "Priority", "Round Robin", "FCFS"], "answerIndex": 2 }
          ]
        };
    }

    // --- Dynamic Reallocation Integration (DEMO MODE) ---
    async function reallocateExamPlan(apiKey, date, timeStr, quizResultsData) {
        await new Promise(r => setTimeout(r, 1500));
        
        return {
          "timeline": [
            {
              "timeLabel": "0:00-0:20",
              "priority": "EMERGENCY FOCUS",
              "title": "Deadlock Handling (Failed Quiz)",
              "content": "You failed the deadlock question. \n- **URGENT**: Review the 4 necessary conditions.\n- Re-read Banker's Algorithm."
            },
            {
              "timeLabel": "0:20-0:30",
              "priority": "HIGH PRIORITY",
              "title": "File System Allocation (Failed Quiz)",
              "content": "- Contiguous allocation causes external fragmentation.\n- Linked allocation solves it but increases overhead."
            }
          ],
          "skipForNow": [
            {
              "topic": "CPU Scheduling (Passed Quiz)",
              "reason": "Mastered in diagnostic quiz. Reallocated this time to Deadlocks."
            },
            {
              "topic": "Paging (Passed Quiz)",
              "reason": "Mastered in diagnostic quiz."
            }
          ]
        };
    }

    // --- Rendering Logic ---
    function renderROI(roiArray) {
        roiTableBody.innerHTML = '';
        if (!roiArray) return;
        
        // Sort descending by ROI Score
        roiArray.sort((a, b) => b.roiScore - a.roiScore);
        
        roiArray.forEach(item => {
            const tr = document.createElement('tr');
            
            // Determine class for ROI color
            let roiClass = 'roi-low';
            if (item.roiScore >= 8) roiClass = 'roi-high';
            else if (item.roiScore >= 5) roiClass = 'roi-medium';
            
            tr.innerHTML = `
                <td><strong>${item.topic}</strong></td>
                <td>${item.importance}</td>
                <td>${item.difficulty}</td>
                <td>${item.timeNeededMins} mins</td>
                <td class="${roiClass}">${item.roiScore}</td>
            `;
            roiTableBody.appendChild(tr);
        });
    }

    function renderTimeline(timelineArray) {
        timelineContainer.innerHTML = '';
        timelineArray.forEach(item => {
            const div = document.createElement('div');
            div.className = `timeline-item priority-${item.priority.replace(/\s+/g, '-').toLowerCase()}`;
            
            const htmlContent = marked.parse(item.content);
            const priorityColor = item.priority.includes('MUST') ? 'var(--danger)' : item.priority.includes('HIGH') ? '#f59e0b' : 'var(--success)';
            
            div.innerHTML = `
                <div class="time-badge">${item.timeLabel}</div>
                <div class="priority-badge" style="color: ${priorityColor}; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;">● ${item.priority}</div>
                <h3>${item.title}</h3>
                <div class="content">${htmlContent}</div>
            `;
            timelineContainer.appendChild(div);
        });
    }

    function renderSkip(skipArray) {
        skipContainer.innerHTML = '';
        if (!skipArray || skipArray.length === 0) {
            skipContainer.innerHTML = '<p class="text-secondary">Nothing to skip. You have enough time to cover the core material.</p>';
            return;
        }
        skipArray.forEach(item => {
            const div = document.createElement('div');
            div.className = 'skip-item';
            div.innerHTML = `
                <h4>${item.topic}</h4>
                <p>${item.reason}</p>
            `;
            skipContainer.appendChild(div);
        });
    }

    function renderMarkdown(container, markdownText) {
        container.innerHTML = marked.parse(markdownText || "*No content provided.*");
    }

    function renderQuiz(quizArray) {
        currentQuizData = quizArray;
        quizContainer.innerHTML = '';
        quizResults.classList.add('hidden');
        submitQuizBtn.classList.remove('hidden');
        
        quizArray.forEach((q, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.dataset.index = index;
            
            const title = document.createElement('h4');
            title.textContent = `${index + 1}. ${q.question}`;
            qDiv.appendChild(title);
            
            const optionsGrid = document.createElement('div');
            optionsGrid.className = 'options-grid';
            
            q.options.forEach((opt, optIndex) => {
                const label = document.createElement('label');
                label.className = 'option-label';
                label.innerHTML = `
                    <input type="radio" name="q${index}" value="${optIndex}">
                    <span>${opt}</span>
                `;
                optionsGrid.appendChild(label);
            });
            
            qDiv.appendChild(optionsGrid);
            quizContainer.appendChild(qDiv);
        });
    }

    // --- Quiz Submission Logic ---
    submitQuizBtn.addEventListener('click', () => {
        let score = 0;
        let allAnswered = true;

        currentQuizData.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            const qDiv = document.querySelector(`.quiz-question[data-index="${index}"]`);
            const optionLabels = qDiv.querySelectorAll('.option-label');

            if (!selected) {
                allAnswered = false;
                return;
            }

            const selectedValue = parseInt(selected.value);
            
            optionLabels.forEach((label, idx) => {
                const input = label.querySelector('input');
                input.disabled = true;
                
                if (idx === q.answerIndex) {
                    label.classList.add('correct');
                } else if (idx === selectedValue && selectedValue !== q.answerIndex) {
                    label.classList.add('incorrect');
                }
            });

            if (selectedValue === q.answerIndex) {
                score++;
                q.passed = true;
            } else {
                q.passed = false;
            }
        });

        if (!allAnswered) {
            alert('Please answer all questions before submitting.');
            return;
        }

        submitQuizBtn.classList.add('hidden');
        quizResults.classList.remove('hidden');
        scoreDisplay.textContent = score;
        
        if (score >= 8) {
            scoreMessage.textContent = "Excellent! You're ready for the exam.";
        } else if (score >= 5) {
            scoreMessage.textContent = "Good job, but you might want to review the short notes again.";
        } else {
            scoreMessage.textContent = "You need more revision. Let's go through the 5-min sheet.";
        }
        
        quizResults.scrollIntoView({ behavior: 'smooth' });
    });

    retryBtn.addEventListener('click', () => {
        renderQuiz(currentQuizData);
        document.getElementById('tab-rapid-test').scrollIntoView({ behavior: 'smooth' });
    });

    reallocateBtn.addEventListener('click', async () => {
        const examDate = document.getElementById('exam-date').value;
        const availableTime = document.getElementById('available-time').value;
        const apiKey = document.getElementById('api-key').value;

        // Prepare quiz results payload for AI
        const quizResultsData = currentQuizData.map(q => ({
            topic: q.topic || 'General',
            question: q.question,
            passed: q.passed
        }));

        reallocateBtn.disabled = true;
        reallocateBtn.querySelector('.btn-text').classList.add('hidden');
        reallocateLoader.classList.remove('hidden');

        try {
            const reallocatedData = await reallocateExamPlan(apiKey, examDate, availableTime, quizResultsData);
            
            // Update UI with new data
            renderTimeline(reallocatedData.timeline);
            renderSkip(reallocatedData.skipForNow);
            
            // Switch to timeline tab automatically
            document.querySelector('.tab-btn[data-tab="timeline"]').click();
            alert("Emergency Reallocation Complete! Check your new Priority Timeline.");
        } catch (error) {
            console.error(error);
            alert(`Reallocation Failed: ${error.message}`);
        } finally {
            reallocateBtn.disabled = false;
            reallocateBtn.querySelector('.btn-text').classList.remove('hidden');
            reallocateLoader.classList.add('hidden');
        }
    });

    // --- Helpers ---
    function setLoading(isLoading) {
        if (isLoading) {
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            generateBtn.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }
});
