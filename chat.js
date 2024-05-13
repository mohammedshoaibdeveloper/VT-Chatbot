document.getElementById('sendBtn').addEventListener('click', function() {
    let userInput = document.getElementById('userInput');
    if (userInput.value.trim() !== "") {
        let userMessage = `<p class="userText"><span>${userInput.value}</span></p>`;
        document.getElementById('chatbox').innerHTML += userMessage;

        fetch('http://137.184.53.123:8080/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id: "unique-session-id", query: userInput.value })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // Handle error response from the API
                let errorMessage = `<p class="botText"><span>Error: ${data.error}. Details: ${data.response_data ? JSON.stringify(data.response_data) : 'No additional details'}</span></p>`;
                document.getElementById('chatbox').innerHTML += errorMessage;
            } else if (data.doctors) {
                // Handle successful response with doctor data
                data.doctors.forEach(doctor => {
                    let doctorMessage = `<p class="botText">
                        <span>Doctor ${doctor.index}: ${doctor.full_name} (${doctor.doctor_username})</span><br>
                        <span>Clinic: ${doctor.hospital_name}</span><br>
                        <span>Email: ${doctor.doctor_email}</span><br>
                        <span>Fees: ${doctor.doctor_fees}</span><br>
                        <span>Rating: ${doctor.doctor_rating}</span><br>
                        <span>Speciality: ${doctor.doctor_speciality}</span><br>
                        <span><img src="${doctor.doctor_image_url}" alt="Doctor Image" style="width: 50px; height: 50px;"></span>
                        </p>`;
                    document.getElementById('chatbox').innerHTML += doctorMessage;
                });
            } else {
                // Handle simple text response
                let botMessage = `<p class="botText"><span>${data.answer}</span></p>`;
                document.getElementById('chatbox').innerHTML += botMessage;
            }
            updateScroll();
        })
        .catch(error => {
            console.error('Error:', error);
            let errorResponse = `<p class="botText"><span>Communication error with the server.</span></p>`;
            document.getElementById('chatbox').innerHTML += errorResponse;
            updateScroll();
        });

        userInput.value = "";
    }
});

function updateScroll() {
    var chatbox = document.getElementById("chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
}