function start(){
    setSelect(techs);
}
function setSelect(data){
    const element = document.getElementById('select');
    element.innerHTML = null;

    data.map((tech) => {element.innerHTML += `<option value="${tech}">${tech}</option>`});
}
function filter(value){
    setSelect(
        techs.filter( res => res.indexOf(value) > -1)
    );
    generator();
}
function setFilter(value){
    document.getElementById('filter').value = value;
    generator();
}
async function generator(){
    //token
    //char
    const filter = document.getElementById('filter').value;
    const password = document.getElementById('password').value;
    const size = parseInt(document.getElementById('size').value);
    const jump = Math.round((filter.length + token.length + password.length) / size);
    let TokenStart;

    if(token[size/2]){
        TokenStart = Math.round(size/2);
    }else{
        TokenStart = Math.round(size/5);
    }

    let i = {
        //string: 0,
        //position: 1,
        filter:	0,
        token: 	TokenStart,
        char:	0,
        size:	0,
        password:	0,
    };

    let data = {
        i,
        key: token + char + filter + password + size,
        filter,
        token,
        char,
        size,
        password
    };

    let key;
    await shuffle(data, (res) => {
        key = res;
    });

    let response;
    await getPass({
            key,
            jump,
            size: parseInt(size),
        }, (res) => {
            response = res; 
        });

        if(document.getElementById('accents').checked){
            response = takeWayAccents(response);
        }

    document.getElementById('result').innerHTML = response;
}

async function shuffle(data, callback){
    let response = [];
    let i = 0;
    let position = 1;

    for await (value of data.key){
        switch(position){
            case 1:
                response[i] = data.filter[data.i.filter];
                if(filter.length <= data.i.filter++ || !data.filter[data.i.filter]) response[i] = value;
            break;
            case 2:
                response[i] = data.token[data.i.token];
                if(token.length == data.i.token++ || data.token[data.i.token]) response[i] = value;
            break;
            case 3:
                response[i] = data.char[data.i.char];
                if(char.length == data.i.char++ || data.char[data.i.char]) response[i] = value;
            break;
            case 4:
                response[i] = data.size[data.i.size];
                if(size.length == data.i.size++) response[i] = value;
            break;
            case 5:
                response[i] = data.password[data.i.password];
                if (password.length == data.i.password++) response[i] = value;
            break;
            case 6:
                response[i] = value;
                position = 0;
            break;						
        }

    i++;
    position++;
    }	

return callback(response.join(''));
}

async function getPass(data, callback){
    let response = [];
    let key = data.key;
    let position;

    for(let i = 0; i <= data.size; i++){
        position = data.jump * i;

        if(!key[position]) key += data.key;

        response[i] = key[position];
    }			

    return callback(response.join(''));
}

function takeWayAccents(string){

    const withAccents 	 = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ"
    const withOutAccents = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    const text = string.split('');

    let response = text.map(res => {
        if(withAccents.indexOf(res) > -1){
            return withOutAccents[withAccents.indexOf(res)];
        }else{
            return res;
        }
    });

    console.log(response);
    return response.join('');
}

function copy(string){
    let element = document.createElement('input');
    element.value = string;
    document.body.appendChild(element);
    element.select();

    try {

        const copied = document.execCommand('copy');

        console.log(copied);

        if(copied) document.getElementById('copied').innerHTML = 'Password was copied';

    } catch(e){
        alert(e);
    }

    document.body.removeChild(element);		
}