import { Grid, Typography, Switch } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import React, { useState, useEffect } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';

import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import './styles.scss';
import Cookies from 'js-cookie';

import api from '../../services/api';
import moment from 'moment';



import { styled } from '@material-ui/styles';


import {
    DataGridPro,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
} from '@mui/x-data-grid-pro';

import {  ptBR } from '@material-ui/data-grid';




const ColorButtonRed = styled(Button)(({ theme }) => ({
    color: 'white',
    backgroundColor: 'red',
    size: 'large',
    borderColor: 'black',
    '&:hover': {
        backgroundColor: 'red',
        color: 'white',
    },
}));

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
   const [somaMilissegundosArrancadasBot, setSomaMilissegundosArrancadasBot] = useState(0);
    const [totalArrancadas, setTotalArracadas] = useState(0);
    const [totalPassagens, setTotalPassagens] = useState(0);
  const [totalArrancadasBot, setTotalArracadasBot] = useState(0);

    const [melhorTempoArrancada, setMelhorTempoArrancada] = useState(0);
    const [melhorTempoPassagem, setMelhorTempoPassagem] = useState(0);
  const [melhorTempoArrancadaBot, setMelhorTempoArrancadaBot] = useState(0);

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

const confirmarExclusao = (idCronometro) => {
  if (window.confirm('Tem certeza que deseja excluir este cronômetro?')) {
    excluirCronometro(idCronometro);
  }
};


const excluirCronometro = async (idCronometro) => {
 

  try {
    const url = `v1/cronometros/excluirporid/${idCronometro}`;
    const response = await api.delete(url);

    if (response.data !== null) {
      listarCronometros();
    }
  } catch (err) {
    alert('Erro de Conexão!');
  }
};


    async function listarCronometros() {

        setLoadingCronometros(true);


        try {

            // console.log("Url: " + url);
            var url = "v1/cronometros/listarPorCiclistaDesc/" + Cookies.get('id_ciclista');
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
                                if (cronometro.millissegundos < accumulator.menorArrancada || accumulator.menorArrancada === undefined) {
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


     // Calcula a soma dos milissegundos bot
                    const { totalMilissegundosArrancadaBot, countTipoCronometroArrancadasBot, menorArrancadaBot } = response.data.reduce(
                        (accumulator, cronometro) => {
                            if (cronometro.tipo_cronometro === 2) {
                                accumulator.totalMilissegundosArrancadaBot += cronometro.millissegundos;
                                accumulator.countTipoCronometroArrancadasBot++;

                                // Verifica se o valor atual é menor do que o menor valor armazenado
                                if (cronometro.millissegundos < accumulator.menorArrancadaBot || accumulator.menorArrancadaBot === undefined) {
                                    accumulator.menorArrancadaBot = cronometro.millissegundos;
                                }
                            }
                            return accumulator;
                        },
                        { totalMilissegundosArrancadaBot: 0, countTipoCronometroArrancadasBot: 0, menorArrancadaBot: undefined }
                    );


                    console.log('Soma dos milissegundos:', totalMilissegundosArrancadaBot);
                    console.log('Número de objetos com tipo_cronometro igual a 2:', countTipoCronometroArrancadasBot);


                    setSomaMilissegundosArrancadasBot(totalMilissegundosArrancadaBot);
                    setTotalArracadasBot(countTipoCronometroArrancadasBot);
                    setMelhorTempoArrancadaBot(menorArrancadaBot);





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


   

    function sair() {

        Cookies.set('token', undefined);
        history.push({
            pathname: '/',

        })

    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }


    const columnsDataGrid = [


        {
            headerName: 'ID',
            field: 'id_cronometro',
            id: 1,
            headerClassName: 'cabecalho_amarelo',
           
        },
        {
            headerName: 'Modo',
            field: 'tipo_cronometro',
           
            id: 2,
            headerClassName: 'cabecalho_amarelo',
            valueFormatter: (params) => {
                const valueFormatted = params.value === 0 ? "LARGADA BIPE" : params.value === 1 ? "PASSAGEM" : "LARGADA BOT";
                return `${valueFormatted}`;
              },

        },
        {
            headerName: 'Data',
            field: 'data_hora_salvamento',
         
            id: 3,

            headerClassName: 'cabecalho_amarelo',
            valueFormatter: (params) => {
                const valueFormatted = formatDataEHour(params.value);
                return `${valueFormatted}`;
              },
 sortComparator: (v1, v2, cellParams1, cellParams2) => {
    // Implemente sua lógica de comparação de datas aqui
    const date1 = new Date(v1);
    const date2 = new Date(v2);
    
    if (date1 < date2) {
      return -1;
    } else if (date1 > date2) {
      return 1;
    } else {
      return 0;
    }
  },

        },

        {
            field: 'millissegundos',
            headerName: 'Tempo',
        
            headerClassName: 'cabecalho_amarelo',
            id: 4,
            valueFormatter: (params) => {
                const valueFormatted = MilissegundosParaTempo(params.value);
                return `${valueFormatted}`;
              },

        },

{
    headerName: 'Ações',
    
    headerClassName: 'cabecalho_amarelo',
    renderCell: (params) => (
      <ColorButtonRed
        variant="contained"
        color="error"
        onClick={() => confirmarExclusao(params.row.id_cronometro)}
      >
        Excluir
      </ColorButtonRed>
    ),
  },


    ];




  const handleCellClick = (param, event) => {
    event.stopPropagation();
  };

  const handleRowClick = (param, event) => {
    event.stopPropagation();
  };

  const onPageChange = (page, pageSize) => {
    setCronometros(cronometros.slice((page - 1) * pageSize, page * pageSize));
  };

  const getRowId = (row) => row.id_cronometro;



  

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
                                            <Typography style={{ fontSize: '14', fontFamily: 'A4 SPEED FONT' }} variant="h5">{totalArrancadas} arrancadas Bipe</Typography>
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

  <Grid
                                        item xs={12} sm={12} md={12} lg={5} xl={5}
                                        container
                                        direction='row'
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                        component={Paper} elevation={6} className={"Paper"}
                                        style={{ backgroundColor: 'purple', color: 'white', margin: 5, padding: 50, marginTop: 20, paddingBottom: 20, borderRadius: '10px' }}

                                    >

                                        <Grid xs={12}
                                        >
                                            <Typography style={{ fontSize: '14', fontFamily: 'A4 SPEED FONT' }} variant="h5">{totalArrancadasBot} arrancadas Botao</Typography>
                                        </Grid>

                                        <Grid xs={1}
                                            style={{ marginLeft: 8 }}
                                        >
                                            <img src="https://cdn-icons-png.flaticon.com/512/1021/1021194.png" alt="Volume Coletado" />

                                        </Grid>

                                        <Grid xs={8}
                                            style={{ paddingLeft: 10 }}
                                        >
                                            <Typography style={{ fontFamily: 'A4 SPEED FONT', marginTop: '0' }} variant="h2">{MilissegundosParaTempo(melhorTempoArrancadaBot)}</Typography>
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
                                            <Typography style={{ fontFamily: 'A4 SPEED FONT', marginTop: '0' }} variant="h5">{MilissegundosParaTempo(somaMilissegundosArrancadasBot)}</Typography>
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
                         <Grid
                         item xs={12}
                container
                direction="column"
                alignItems="center"
                justifyContent={"center"}
                        >
          
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
                     
  </Grid>

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
                                style={{ backgroundColor: 'yellow', marginLeft: 40, marginRight: 40 }}
                            >

                                {
                                    loadingCronometros ?
                                        <Skeleton animation={"wave"} width={'100%'} style={{ backgroundColor: '#48D1CC' }
                                        } >
                                        </Skeleton>
                                        :
                               

                                             
                                                    <DataGridPro localeText={ptBR.props.MuiDataGrid.localeText}
                                                       
                                                            getRowId={getRowId}
                                                            rows={cronometros} columns={columnsDataGrid} disableColumnResize={false}
                                                            onCellClick={handleCellClick}
                                                            onRowClick={handleRowClick}
                                                            components={{
                                                                Toolbar: CustomToolbar,
                                                             }}
 autoHeight
columnBuffer={2} 
                                                            pagination
                                                            page={0}
                                                            pageSize={25}

                                                            rowsPerPageOptions={[]}
                                                            onPageChange={onPageChange}
                                                          getRowClassName={(params) => {
  
   
   return  'logs';
}}
sx={{
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "yellow",
    color: "black"
  },
}}
                                                           
                                                        />
                                                     
                                               

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



