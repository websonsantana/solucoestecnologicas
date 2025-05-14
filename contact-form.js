// Configurações do formulário de contato
const CONFIG = {
    EMAIL: 'contato.webson@gmail.com',
    WHATSAPP: '5581981521109',
    SUBJECT: 'Novo contato do site WS Soluções Tecnológicas'
};

// Função para validar o formulário
function validateForm() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const servico = document.getElementById('servico').value;
    const mensagem = document.getElementById('mensagem').value;
    
    // Validação básica
    if (!nome || !email || !telefone || !mensagem) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }
    
    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um endereço de e-mail válido.');
        return false;
    }
    
    return true;
}

// Função para enviar para o WhatsApp
function sendToWhatsApp(formData) {
    const nome = encodeURIComponent(formData.nome);
    const email = encodeURIComponent(formData.email);
    const telefone = encodeURIComponent(formData.telefone);
    const servico = encodeURIComponent(formData.servico || 'Não especificado');
    const mensagem = encodeURIComponent(formData.mensagem);
    
    const text = `*Olá tenho interesse quero mais informações*%0A%0A*Nome:* ${nome}%0A*E-mail:* ${email}%0A*Telefone:* ${telefone}%0A*Serviço:* ${servico}%0A*Mensagem:* ${mensagem}`;
    
    const whatsappURL = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${text}`;
    
    // Abre o WhatsApp em uma nova janela
    window.open(whatsappURL, '_blank');
}

// Função para enviar por e-mail usando EmailJS
function sendEmail(formData) {
    // Verifica se o EmailJS está carregado
    if (typeof emailjs !== 'undefined') {
        // Parâmetros para o template
        const templateParams = {
            from_name: formData.nome,
            from_email: formData.email,
            from_phone: formData.telefone,
            service: formData.servico || 'Não especificado',
            message: formData.mensagem,
            to_email: CONFIG.EMAIL
        };

        // Envia o e-mail
        emailjs.send('default_service', 'template_contact', templateParams)
            .then(function(response) {
                console.log('E-mail enviado com sucesso!', response.status, response.text);
                alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
                
                // Limpa o formulário
                document.getElementById('contact-form').reset();
            }, function(error) {
                console.log('Falha ao enviar e-mail...', error);
                alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp.');
            });
    } else {
        console.error('EmailJS não está carregado');
        alert('Não foi possível enviar o e-mail. Redirecionando para o WhatsApp...');
        sendToWhatsApp(formData);
    }
}

// Inicialização quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o script do EmailJS ao documento
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Inicializa o EmailJS quando o script for carregado
    script.onload = function() {
        // IMPORTANTE: Para configurar o EmailJS:
        // 1. Crie uma conta gratuita em https://www.emailjs.com/
        // 2. Crie um serviço de e-mail (Gmail, Outlook, etc)
        // 3. Crie um template de e-mail com as variáveis: from_name, from_email, from_phone, service, message
        // 4. Substitua abaixo sua chave pública do EmailJS
        emailjs.init("TXZjDIzJ1-mYgJFD5"); // Substitua por sua chave pública do EmailJS
    };
    
    // Configura o formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (validateForm()) {
                const formData = {
                    nome: document.getElementById('nome').value,
                    email: document.getElementById('email').value,
                    telefone: document.getElementById('telefone').value,
                    servico: document.getElementById('servico').value,
                    mensagem: document.getElementById('mensagem').value
                };
                
                // Opção para escolher entre e-mail ou WhatsApp
                const sendMethod = document.querySelector('input[name="send-method"]:checked')?.value || 'email';
                
                if (sendMethod === 'whatsapp') {
                    sendToWhatsApp(formData);
                } else {
                    sendEmail(formData);
                }
            }
        });
    }
    
    // Máscara para o campo de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            // Formata o número de telefone
            if (value.length > 2 && value.length <= 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            }
            
            e.target.value = value;
        });
    }
});
