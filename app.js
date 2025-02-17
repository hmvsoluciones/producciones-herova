const URL_VCARD = 'https://hmvsoluciones.github.io/producciones-herova/';
// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service worker registrado', reg))
        .catch((err) => console.log('Error al registrar service worker', err));
}

// Función para compartir
function compartir() {
    const shareOptions = document.getElementById('shareOptions');
    if (shareOptions.style.display === 'none' || shareOptions.style.display === '') {
        shareOptions.style.display = 'block';
    } else {
        shareOptions.style.display = 'none';
    }
}

// Función para mostrar QR
function mostrarQR() {
    const qrcode = document.getElementById('qrcode');
    if (qrcode.style.display === 'none' || qrcode.style.display === '') {
        qrcode.style.display = 'block';
        qrcode.innerHTML = '';  // Clear previous QR code
        new QRCode(qrcode, {
            text: window.location.href,
            width: 228,
            height: 228
        });
    } else {
        qrcode.style.display = 'none';
    }
}

// Función para guardar contacto
function guardarContacto() {
    if ('contacts' in navigator && 'ContactsManager' in window) {
        const props = ['name', 'tel', 'email', 'address', 'icon', 'url'];
        const opts = { multiple: false };

        navigator.contacts.select(props, opts)
            .then((contacts) => {
                const contact = contacts[0];
                contact.name = "Producciones Herova";
                contact.tel = "+5215537184385";
                contact.email = "hector.agm5@hotmail.com";
                contact.url = URL_VCARD;
                // Aquí podrías añadir más detalles del contacto
                console.log(contact);
                alert('Contacto guardado exitosamente');
            })
            .catch((err) => {
                console.log(err);
                console.log('Error al guardar el contacto');
                downloadVCard();
            });
    } else {
        console.log('Tu navegador no soporta la API de Contactos. Se descargará un archivo VCF para que puedas agregar el contacto manualmente.');
        downloadVCard();
    }
}

function downloadVCard() {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Producciones Herova
TEL:+5215537184385
EMAIL:hector.agm5@hotmail.com
URL:${URL_VCARD}
END:VCARD`;
    
    const blob = new Blob([vCardData], { type: 'text/x-vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'contacto.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Función para compartir en redes sociales
function compartirEnRedSocial(red) {
    let url = '';
    const texto = 'Servicios profesionales DJ';
    const enlace = encodeURIComponent(URL_VCARD);

    switch(red) {
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${enlace}`;
            break;
        case 'linkedin':
            url = `https://www.linkedin.com/shareArticle?mini=true&url=${enlace}&title=${encodeURIComponent(texto)}`;
            break;
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${enlace}`;
            break;
        case 'pinterest':
            url = `https://pinterest.com/pin/create/button/?url=${enlace}&description=${encodeURIComponent(texto)}`;
            break;
        case 'whatsapp':
            url= `whatsapp://send/?text=${texto} ${enlace}`;
            break;
    }

    if (url) {
        window.open(url, '_blank');
    }
}

// Función para compartir por correo
function compartirPorCorreo() {
    const subject = encodeURIComponent('Tarjeta Digital');
    const body = encodeURIComponent(`¡Hola! Quiero compartir contigo la tarjeta digital de Producciones Herova. Visita: ${URL_VCARD}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}