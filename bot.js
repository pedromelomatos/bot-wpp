const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();
const horarios_e_atendidos = new Map () //criando um map que guardará os números dos usuários que mandaram mensagem e o horário que mandaram, pra melhorar a comunicação.
const numero_atendente = '5511984576289@c.us'

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', async message => {

    if (message.fromMe) {
        return;
    }

	if (message.body === 'Bom dia.') {

		await client.sendMessage(message.from, 'Olá!');
        return
	}
    const numero_usuario = message.from
    const agora = Date.now()
    const ultimo_atendimento = horarios_e_atendidos.get(numero_usuario) //fazendo um get no map de horarios e atendidos pra ver se esse usuario já foi atendido e qual foi o horário
    if (!ultimo_atendimento || agora - ultimo_atendimento > 86400000)//se esse usuario nunca foi atendido ou se já se passou mais de um dia desde que ele foi atendido:
    {
        horarios_e_atendidos.set(numero_usuario, agora) //adicionando o usuario e o horario de atendimento dele
        await client.sendMessage(message.from, 'Olá! Seja bem-vindo à clínica. Digite:\n1 - Falar com atendente\n2 - Saber mais sobre a clínica')
        return
    } 
    
    if(message.body === '1'){
        await client.sendMessage(message.from, "👩‍💼 Vamos chamar um atendente para você.")
        await client.sendMessage(numero_atendente, `📞 O número ${numero_usuario} está solicitando atendimento.`)

    }

	else if (message.body === '2') {

		await client.sendMessage(message.from, "🏥 Sobre a clínica:\n\n- Tratamentos: Psicoterapia Infantil, Psicopedagogia Fonoaudiologia e Nutrição Comportamental.\n- Localização: Santana, São Paulo (SP).\n- Site: https://deupositivo.com.br\n\n");
	}
    else{
        await client.sendMessage(message.from, "🤔 O que você gostaria?\nDigite:\n1 - Falar com atendente\n2 - Saber mais sobre a clínica")
    }
});


client.initialize();