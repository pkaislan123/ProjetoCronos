import { Grid, Typography, Switch } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Box from '@material-ui/core/Box';
import React, { useState, useEffect } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';

import { useHistory } from 'react-router-dom';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { styled } from '@material-ui/styles';
import './styles.scss';
import Cookies from 'js-cookie';

import api from '../../services/api';
import moment from 'moment';





export const MuiSwitchLarge = styled(Switch)(({ theme }) => ({
    width: 80,
    height: 50,
    padding: 7,
    "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
            transform: "translateX(30px)",
        },
    },
    "& .MuiSwitch-thumb": {
        width: 40,
        height: 40,
    },
    "& .MuiSwitch-track": {
        borderRadius: 30 / 2,
    },
}));






export default function MinhaConta() {


    const [loadingCronometros, setLoadingCronometros] = useState(true);
    const [cronometros, setCronometros] = useState(null);
    const history = useHistory();

    const [somaMilissegundosArrancadas, setSomaMilissegundosArrancadas] = useState(0);
    const [somaMilissegundosPassagens, setSomaMilissegundosPassagens] = useState(0);
    const [totalArrancadas, setTotalArracadas] = useState(0);
    const [totalPassagens, setTotalPassagens] = useState(0);

    const [melhorTempoArrancada, setMelhorTempoArrancada] = useState(0);
    const [melhorTempoPassagem, setMelhorTempoPassagem] = useState(0);


    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };


    function MilissegundosParaTempo(milissegundos) {
        const minutos = Math.floor(milissegundos / 60000);
        const segundos = Math.floor((milissegundos % 60000) / 1000);
        const milissegundosRestantes = milissegundos % 1000;

        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}:${milissegundosRestantes.toString().padStart(3, '0')}`;
    }



    useEffect(() => {


        listarCronometros();

    }, []);




    async function listarCronometros() {

        setLoadingCronometros(true);


        try {

            // console.log("Url: " + url);
            var url = "v1/cronometros/listarPorCiclista/" + Cookies.get('id_ciclista');
            // console.log("Url: " + url);
            await api.get(url).then(function (response) {

                if (response.data !== null) {
                    setCronometros(response.data);


                    // Calcula a soma dos milissegundos
                    const { totalMilissegundosArrancada, countTipoCronometroArrancadas, menorArrancada } = response.data.reduce(
                        (accumulator, cronometro) => {
                            if (cronometro.tipo_cronometro === 0) {
                                accumulator.totalMilissegundosArrancada += cronometro.millissegundos;
                                accumulator.countTipoCronometroArrancadas++;

                                // Verifica se o valor atual é menor do que o menor valor armazenado
                                if (cronometro.millissegundos < accumulator.menorArrancada  || accumulator.menorArrancada === undefined) {
                                    accumulator.menorArrancada = cronometro.millissegundos;
                                }
                            }
                            return accumulator;
                        },
                        { totalMilissegundosArrancada: 0, countTipoCronometroArrancadas: 0, menorArrancada: undefined }
                    );


                    console.log('Soma dos milissegundos:', totalMilissegundosArrancada);
                    console.log('Número de objetos com tipo_cronometro igual a 0:', countTipoCronometroArrancadas);


                    setSomaMilissegundosArrancadas(totalMilissegundosArrancada);
                    setTotalArracadas(countTipoCronometroArrancadas);
                    setMelhorTempoArrancada(menorArrancada);

                    const { totalMilissegundosPassagens, countTipoCronometroPassagens, menorPassagem } = response.data.reduce(
                        (accumulator, cronometro) => {
                            if (cronometro.tipo_cronometro === 1) {
                                accumulator.totalMilissegundosPassagens += cronometro.millissegundos;
                                accumulator.countTipoCronometroPassagens++;

                                // Verifica se o valor atual é menor do que o menor valor armazenado
                                if (cronometro.millissegundos < accumulator.menorPassagem || accumulator.menorPassagem === undefined) {
                                    accumulator.menorPassagem = cronometro.millissegundos;
                                }
                            }
                            return accumulator;
                        },
                        { totalMilissegundosPassagens: 0, countTipoCronometroPassagens: 0, menorPassagem: undefined }
                    );

                    setSomaMilissegundosPassagens(totalMilissegundosPassagens);
                    setTotalPassagens(countTipoCronometroPassagens);
                    setMelhorTempoPassagem(menorPassagem);



                    setLoadingCronometros(false);

                }


            });



        } catch (_err) {
            alert("Erro de Conexão !");

        }
    }


    function formatDataEHour(data) {
        var dataCtr = moment(data, "YYYY-MM-DD hh:mm:ss");
        return dataCtr.format("DD/MM/YYYY HH:mm");
    }


    function RowCronometro(props) {
        const { row } = props;


        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} style={{ fontFamily: 'A4 SPEED FONT', textAlign: "center", fontSize: 14, color: 'white', backgroundColor: 'black' }}>

                    <TableCell colSpan={1} align="center">
                        <Typography variant="h6" component="h4" style={{ fontFamily: 'A4 SPEED FONT', color: 'white' }}>
                            {row.id_cronometro}
                        </Typography>

                    </TableCell>

                    <TableCell colSpan={1} align="center">
                        <Typography variant="h6" component="h4" style={{ fontFamily: 'A4 SPEED FONT', color: 'white' }}>
                            {row.tipo_cronometro === 0 ? "Arrancada" : "Passagem"}
                        </Typography>
                    </TableCell>

                    <TableCell colSpan={1} align="center">
                        <Typography variant="h6" component="h4" style={{ fontFamily: 'A4 SPEED FONT', color: 'white' }}>
                            {formatDataEHour(row.data_hora_salvamento)}
                        </Typography>
                    </TableCell>


                    <TableCell colSpan={1} align="center">
                        <Typography variant="h6" component="h4" style={{ fontFamily: 'A4 SPEED FONT', color: 'white' }}>
                            {MilissegundosParaTempo(row.millissegundos)}
                        </Typography>
                    </TableCell>

                </TableRow>
            </React.Fragment>
        );
    }




    function sair() {

        Cookies.set('token', undefined);
        history.push({
            pathname: '/',

        })

    }



    return (


        <div style={{
            margin: 0,
            backgroundColor: 'black',
            fontFamily: 'A4 SPEED FONT'
        }}>

            <div>
                {
                    loadingCronometros ?
                        <Skeleton animation={"wave"} width={'100%'} style={{ backgroundColor: '#48D1CC' }
                        } >
                        </Skeleton>
                        :
                        <div   >
                            <Grid
                                container
                                item xs={12}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >




                                <Grid item xs={12}
                                    container
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                >

                                    <Grid
                                        item xs={12} sm={12} md={12} lg={5} xl={5}
                                        container
                                        direction='row'
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                        component={Paper} elevation={6} className={"Paper"}
                                        style={{ backgroundColor: 'blue', color: 'white', margin: 5, padding: 50, marginTop: 20, paddingBottom: 20, borderRadius: '10px' }}

                                    >

                                        <Grid xs={12}
                                        >
                                            <Typography style={{ fontSize: '14', fontFamily: 'A4 SPEED FONT' }} variant="h5">{totalArrancadas} arrancadas</Typography>
                                        </Grid>

                                        <Grid xs={1}
                                            style={{ marginLeft: 8 }}
                                        >
                                            <img src="https://cdn-icons-png.flaticon.com/512/1021/1021194.png" alt="Volume Coletado" />

                                        </Grid>

                                        <Grid xs={8}
                                            style={{ paddingLeft: 10 }}
                                        >
                                            <Typography style={{ fontFamily: 'A4 SPEED FONT', marginTop: '0' }} variant="h2">{MilissegundosParaTempo(melhorTempoArrancada)}</Typography>
                                        </Grid>

                                        <Grid xs={2}
                                        >
                                        </Grid>


                                        <Grid xs={1}
                                        >
                                            <img src="https://cdn-icons-png.flaticon.com/512/4474/4474370.png" alt="Volume Coletado" />

                                        </Grid>

                                        <Grid xs={11}
                                            style={{ paddingLeft: 10 }}
                                        >
                                            <p style={{ margin: '0', fontSize: '5', fontFamily: 'A4 SPEED FONT' }}>total: </p>
                                            <Typography style={{ fontFamily: 'A4 SPEED FONT', marginTop: '0' }} variant="h5">{MilissegundosParaTempo(somaMilissegundosArrancadas)}</Typography>
                                        </Grid>

                                    </Grid>

                                    <Grid
                                        item xs={12} sm={12} md={12} lg={5} xl={5}
                                        container
                                        direction='row'
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                        component={Paper} elevation={6} className={"Paper"}
                                        style={{ backgroundColor: 'green', color: 'white', margin: 5, padding: 50, marginTop: 20, paddingBottom: 20, borderRadius: '10px' }}

                                    >

                                        <Grid xs={12}
                                        >
                                            <Typography style={{ fontSize: '14', fontFamily: 'A4 SPEED FONT' }} variant="h5">{totalPassagens} passagens</Typography>
                                        </Grid>

                                        <Grid
                                            item xs={1}
                                            style={{ marginLeft: 8 }}
                                        >
                                            <img src="https://cdn-icons-png.flaticon.com/512/1021/1021194.png" alt="Volume Coletado" />

                                        </Grid>

                                        <Grid
                                            item xs={8}

                                            style={{ paddingLeft: 10 }}
                                        >
                                            <Typography style={{ fontFamily: 'A4 SPEED FONT', marginTop: '0' }} variant="h2">{MilissegundosParaTempo(melhorTempoPassagem)}</Typography>
                                        </Grid>

                                        <Grid xs={2}
                                        >
                                        </Grid>


                                        <Grid xs={1}
                                        >
                                            <img src="https://cdn-icons-png.flaticon.com/512/4474/4474370.png" alt="Volume Coletado" />

                                        </Grid>

                                        <Grid xs={11}
                                            style={{ paddingLeft: 10 }}
                                        >
                                            <p style={{ margin: '0', fontSize: '5', fontFamily: 'A4 SPEED FONT' }}>total: </p>
                                            <Typography style={{ fontFamily: 'A4 SPEED FONT', marginTop: '0' }} variant="h5">{MilissegundosParaTempo(somaMilissegundosPassagens)}</Typography>
                                        </Grid>

                                    </Grid>

                                </Grid>


                            </Grid>
                        </div>

                }


            </div>


            <Grid
                item xs={12}
                container
                direction="column"
                alignItems="center"
                justifyContent={"center"}
            >

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>

                    <Box style={{ backgroundColor: 'white', width: '100%', alignItems: 'center', }}>
                        <AppBar position="static" >

                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="secondary"
                                textColor="inherit"
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"


                            >

                                <Tab label="Cronometros" style={{ fontSize: 22, fontFamily: 'A4 SPEED FONT', color: 'black', backgroundColor: 'yellow' }} />

                            </Tabs>
                        </AppBar>

                    </Box>
                </div>


                <SwipeableViews
                    index={value}
                    onChangeIndex={handleChangeIndex}
                    style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 5 }}
                >


                    <div value={value} index={0}
                        style={{ justifyContent: 'center', alignItems: 'center', color: 'white', backgroundColor: 'black' }}
                    >

                        <Grid
                            container
                            item xs={12}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >


                            <Grid
                                container
                                item xs={12}
                                alignItems={"center"}
                                justifyContent={"center"}
                                style={{ backgroundColor: 'red', marginLeft: 40, marginRight: 40 }}
                            >

                                {
                                    loadingCronometros ?
                                        <Skeleton animation={"wave"} width={'100%'} style={{ backgroundColor: '#48D1CC' }
                                        } >
                                        </Skeleton>
                                        :
                                        <Grid
                                            item xs={12} sm={12} md={12} lg={12} xl={12}
                                            container
                                            direction="row"
                                            alignItems="center"
                                            justifyContent={"center"}

                                        >

                                            <Grid item xs={12}
                                                container
                                                direction="row"
                                                alignItems="center"
                                                style={{ backgroundColor: 'yellow' }}
                                            >

                                                <TableContainer component={Paper} style={{ backgroundColor: 'white' }}>
                                                    <Table aria-label="collapsible table">
                                                        <TableHead style={{ backgroundColor: 'white' }}>
                                                            <TableRow style={{ fontSize: 8 }}>
                                                                <TableCell style={{ fontFamily: 'A4 SPEED FONT', backgroundColor: 'yellow', color: 'black', position: "sticky", top: 0, textAlign: "center" }} colSpan={1}>ID</TableCell>
                                                                <TableCell style={{ fontFamily: 'A4 SPEED FONT', backgroundColor: 'yellow', color: 'black', position: "sticky", top: 0, textAlign: "center" }} colSpan={1}>Modo</TableCell>
                                                                <TableCell style={{ fontFamily: 'A4 SPEED FONT', backgroundColor: 'yellow', color: 'black', position: "sticky", top: 0, textAlign: "center" }} colSpan={1}>Data</TableCell>
                                                                <TableCell style={{ fontFamily: 'A4 SPEED FONT', backgroundColor: 'yellow', color: 'black', position: "sticky", top: 0, textAlign: "center" }} colSpan={1}>Cronômetro</TableCell>


                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {cronometros.map((cronometro) => (
                                                                <RowCronometro key={cronometro.id_cronometro} row={cronometro} />
                                                            ))}


                                                        </TableBody>
                                                    </Table>
                                                </TableContainer >
                                            </Grid>
                                        </Grid>
                                }
                            </Grid>
                        </Grid>

                    </div >





                </SwipeableViews>
            </Grid>

            <Grid item xs={12} container justifyContent='center'>
                <Grid item xs={6} sm={6} md={6} component={Paper} elevation={10} square
                    style={{ backgroundColor: 'black' }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={sair}
                        style={{ fontFamily: 'A4 SPEED FONT', margin: 30 }}

                    >
                        Sair
                    </Button>

                </Grid>
            </Grid>


        </div >


    );
}



