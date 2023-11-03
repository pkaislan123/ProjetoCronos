import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import { useHistory } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import './styles.scss';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import './styles.scss';

import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '50vh',
    },

    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    entrada: {
        fontFamily: 'A4 SPEED FONT',
        fontSize: 22,
        color:'white',
    },
    saida: {
        fontFamily: 'A4 SPEED FONT',
        fontSize: 22,
        color:'white',
        maxLength: 15,
         minLength: 8,
    },
}));

export default function Login() {

    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const [erroSenha, setErroSenha] = useState(false);
    const [textoErroSenha, setTextoErroSenha] = useState('');



    const history = useHistory();

    function validateSenha() {

        if (senha.length > 2) {

            setErroSenha(false);
            setTextoErroSenha('');
            return true;
        } else {

            setErroSenha(true);
            setTextoErroSenha("Revise esse campo");

            return false;
        }
    }





    async function logar() {
        try {

            if (validateSenha()) {


                console.log("logar chamado, username: " + username + " senha: " + senha);
                const credentials = {
                    login: username,
                    senha: senha
                }
                const response = await api.post('v1/ciclistas/login', credentials);


                if(response.data.id_ciclista > 0){
                    Cookies.set('token', true);
    
                    Cookies.set('id_ciclista', response.data.id_ciclista);
    
        
                    console.log("token: " + Cookies.get('token'));
    
                        history.push({
                            pathname: '/minhaconta',
    
                        })
                    
                }else{
                    setErroSenha(true);
                    setTextoErroSenha("Usuário ou Senha Inválidos");
                }
               



            }
        } catch (_err) {
            console.log("erro: " + _err);
            try {
                if (_err.response.status === 401) {
                    console.log("erro 401, login errado: ");
                    setErroSenha(true);
                    setTextoErroSenha("Usuário ou Senha Inválidos");
                } else {
                    alert("Erro ao Logar! Verifique sua conexão com a internet! Tente Novamente em alguns instantes!");
                    setErroSenha(false);
                    setTextoErroSenha("");

                }
                return 0;
            } catch (_err) {
                alert("Erro ao Logar! Verifique sua conexão com a internet! Tente Novamente em alguns instantes!");

            }
        }
    };



    return (
        <div   style={{ backgroundColor: 'black' }}>


          

                <div style={{ height: 1, backgroundColor: 'black' }}>
                </div>

               

                <div style={{ paddingTop: 40, paddingBottom: 80, backgroundColor: 'black', fontFamily: 'A4 SPEED FONT' }}>
                    <Grid container justifyContent='center'>
                        <Grid item xs={12} sm={8}  md={5} component={Paper} elevation={10} square 
                         style={{backgroundColor: 'black'}}
                        >
                            <div className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <CssBaseline />

                                <TextField
                                    id="usuario"
                                    variant="standard"
                                    margin="normal"
                                    name="usuario"
                                    fullWidth
                                    label="Usuario"
                                    required
                                    autoComplete="usuario"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    inputProps={{   style: { color: 'white', fontFamily: 'A4 SPEED FONT' , maxLength: 60, minLength: 15}    }}
                                    InputLabelProps={{ className: classes.entrada }}
                                    style={{ paddingTop: 5, paddingBottom: 10 , fontFamily: 'A4 SPEED FONT' }}
                                />

                                <TextField
                                    error={erroSenha}
                                    id="password"
                                    helperText={textoErroSenha}
                                    variant="standard"
                                    name="password"
                                    fullWidth
                                    label="Senha"
                                    required
                                    type="password"
                                    autoComplete="current-password"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    inputProps={{   style: { color: 'white', fontFamily: 'A4 SPEED FONT' , maxLength: 60, minLength: 15}    }}
                                    InputLabelProps={{ className: classes.entrada }}
                                    style={{ paddingTop: 5, paddingBottom: 10, fontFamily: 'A4 SPEED FONT', color:'white'  }}

                                />

                              
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={logar}
                                        style={{fontFamily: 'A4 SPEED FONT' }}

                                >
                                    Entrar
                                </Button>
                               
                            </div>
                        </Grid>
                    </Grid>
                </div>

                      </div>
    );
}

