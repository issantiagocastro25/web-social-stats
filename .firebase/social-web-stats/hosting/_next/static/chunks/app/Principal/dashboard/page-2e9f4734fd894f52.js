(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[568],{38923:function(i,s,e){Promise.resolve().then(e.bind(e,30088))},30088:function(i,s,e){"use strict";e.r(s),e.d(s,{default:function(){return m}});var a=e(57437),o=e(2265),d=e(65506),t=i=>{let{searchTerm:s,setSelectedEntity:e}=i,o=[{name:"Escuela de Salud Sur Colombiana"},{name:"Asociaci\xf3n Colombiana de Facultades de Medicina (Ascofame)"},{name:"Centros de Educaci\xf3n en Salud (Cedes)"},{name:"Consultor Salud"},{name:"Escuela Colombiana de Salud"},{name:"Escuela de Salud del Cauca"},{name:"Escuela de Salud San Pedro Claver"},{name:"Escuela para auxiliares de enfermer\xeda San Rafael"},{name:"Fundaci\xf3n Universitaria de Ciencias de la salud (FUCS)"},{name:"Uniandes - Facultad de medicina"}].filter(i=>i.name.toLowerCase().includes(s.toLowerCase())).slice(0,4);return(0,a.jsx)("div",{className:"flex justify-between space-x-4 overflow-x-auto p-4",children:o.map((i,s)=>(0,a.jsx)("div",{className:"flex-1",children:(0,a.jsx)(d.Zb,{imgSrc:"/assets/imgs/images.png",className:"h-full cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out",onClick:()=>{e(i.name),console.log("Entidad seleccionada en CardList:",i.name)},children:(0,a.jsx)("h5",{className:"text-xl font-bold tracking-tight text-gray-900 dark:text-white",children:i.name})})},s))})},r=e(70491),u=e(75203),c=e(99295),n=i=>{let{selectedEntity:s,entityData:e}=i,o=e[s];if(!o)return null;let d=[{name:o.institucion,Facebook:o.facebook.seguidores||0,YouTube:o.youtube.seguidores||0,Twitter:o.twitter.seguidores||0,Instagram:o.instagram.seguidores||0,TikTok:o.tiktok.seguidores||0}];return(0,a.jsxs)(u.Z,{className:"mt-8",children:[(0,a.jsxs)(c.Z,{children:["Estad\xedsticas de Redes Sociales para ",o.institucion]}),(0,a.jsx)(r.Z,{className:"mt-6",data:d,index:"name",categories:["Facebook","YouTube","Twitter","Instagram","TikTok"],colors:["blue","red","cyan","violet","pink"],valueFormatter:i=>Intl.NumberFormat("us").format(i).toString(),yAxisWidth:48})]})},l=i=>{var s,e,o,d,t,r,u,c,n,l,v,g,b,m;let{entityData:p}=i;return p?(0,a.jsx)("div",{className:"overflow-x-auto mb-6",children:(0,a.jsxs)("table",{className:"min-w-full bg-white border border-gray-200 rounded-md",children:[(0,a.jsx)("thead",{className:"bg-[#7A4993] text-white",children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{className:"py-2 px-4 border-b w-fixed w-96",children:"Instituci\xf3n"}),(0,a.jsx)("th",{className:"py-2 px-4 border-b",children:"Ciudad"}),(0,a.jsx)("th",{className:"py-2 px-4 border-b",children:"Tipo"}),(0,a.jsx)("th",{className:"py-2 px-4 border-b",children:"Red Social"}),(0,a.jsx)("th",{className:"py-2 px-4 border-b",children:"Seguidores"}),(0,a.jsx)("th",{className:"py-2 px-4 border-b",children:"Videos"}),(0,a.jsx)("th",{className:"py-2 px-4 border-b",children:"Visitas"}),(0,a.jsx)("th",{className:"py-2 px-4 border-b",children:"Visitas por Video"})]})}),(0,a.jsxs)("tbody",{children:[(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"py-2 px-4 border-b",rowSpan:5,children:p.institucion}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",rowSpan:5,children:p.ciudad||"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",rowSpan:5,children:p.tipo}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"Facebook"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(s=p.facebook.seguidores)&&void 0!==s?s:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(e=p.facebook.videos)&&void 0!==e?e:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(o=p.facebook.visitas)&&void 0!==o?o:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(d=p.facebook.visitasPorVideo)&&void 0!==d?d:"-"})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"YouTube"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(t=p.youtube.seguidores)&&void 0!==t?t:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(r=p.youtube.videos)&&void 0!==r?r:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(u=p.youtube.visitas)&&void 0!==u?u:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(c=p.youtube.visitasPorVideo)&&void 0!==c?c:"-"})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"Twitter"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(n=p.twitter.seguidores)&&void 0!==n?n:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"-"})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"Instagram"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(l=p.instagram.seguidores)&&void 0!==l?l:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(v=p.instagram.videos)&&void 0!==v?v:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(g=p.instagram.visitas)&&void 0!==g?g:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(b=p.instagram.visitasPorVideo)&&void 0!==b?b:"-"})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"TikTok"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:null!==(m=p.tiktok.seguidores)&&void 0!==m?m:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"-"}),(0,a.jsx)("td",{className:"py-2 px-4 border-b",children:"-"})]})]})]})}):(0,a.jsx)("div",{children:"No entity selected"})};let v={"Escuela de Salud Sur Colombiana":{institucion:"Escuela de Salud Sur Colombiana",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:4074,videos:1,visitas:919,visitasPorVideo:919},twitter:{seguidores:0},instagram:{seguidores:538,videos:0,visitas:0,visitasPorVideo:0},youtube:{seguidores:0,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Asociaci\xf3n Colombiana de Facultades de Medicina (Ascofame)":{institucion:"Asociaci\xf3n Colombiana de Facultades de Medicina (Ascofame)",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:12781,videos:1,visitas:2129,visitasPorVideo:2129},twitter:{seguidores:4383},instagram:{seguidores:123,videos:0,visitas:0,visitasPorVideo:0},youtube:{seguidores:3420,videos:57031,visitas:0,visitasPorVideo:464},tiktok:{seguidores:0}},"Centros de Educaci\xf3n en Salud (Cedes)":{institucion:"Centros de Educaci\xf3n en Salud (Cedes)",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:3201,videos:1,visitas:131,visitasPorVideo:131},twitter:{seguidores:0},instagram:{seguidores:3236,videos:0,visitas:0,visitasPorVideo:0},youtube:{seguidores:0,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Consultor Salud":{institucion:"Consultor Salud",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:64416,videos:22,visitas:25285,visitasPorVideo:1149},twitter:{seguidores:7305},instagram:{seguidores:4314,videos:148,visitas:147774,visitasPorVideo:998},youtube:{seguidores:999,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Escuela Colombiana de Salud":{institucion:"Escuela Colombiana de Salud",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:2395,videos:0,visitas:0,visitasPorVideo:0},twitter:{seguidores:0},instagram:{seguidores:28,videos:1,visitas:211,visitasPorVideo:211},youtube:{seguidores:3,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Escuela de Salud del Cauca":{institucion:"Escuela de Salud del Cauca",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:9612,videos:0,visitas:0,visitasPorVideo:0},twitter:{seguidores:0},instagram:{seguidores:1566,videos:14,visitas:16746,visitasPorVideo:1196},youtube:{seguidores:139,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Escuela de Salud San Pedro Claver":{institucion:"Escuela de Salud San Pedro Claver",ciudad:"Bogot\xe1",tipo:"Educaci\xf3n",facebook:{seguidores:1675,videos:0,visitas:0,visitasPorVideo:0},twitter:{seguidores:12},instagram:{seguidores:471,videos:9,visitas:7553,visitasPorVideo:839},youtube:{seguidores:52,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Escuela para auxiliares de enfermer\xeda San Rafael":{institucion:"Escuela para auxiliares de enfermer\xeda San Rafael",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:3395,videos:2,visitas:883,visitasPorVideo:442},twitter:{seguidores:1},instagram:{seguidores:0,videos:0,visitas:0,visitasPorVideo:0},youtube:{seguidores:21,videos:0,visitas:8677,visitasPorVideo:0},tiktok:{seguidores:0}},"Fundaci\xf3n Universitaria de Ciencias de la salud (FUCS)":{institucion:"Fundaci\xf3n Universitaria de Ciencias de la salud (FUCS)",ciudad:"Bogot\xe1",tipo:"Educaci\xf3n",facebook:{seguidores:59004,videos:51,visitas:65973,visitasPorVideo:1294},twitter:{seguidores:4529},instagram:{seguidores:12468,videos:513,visitas:268962,visitasPorVideo:524},youtube:{seguidores:743993,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Uniandes - Facultad de medicina":{institucion:"Uniandes - Facultad de medicina",ciudad:"Bogot\xe1",tipo:"Educaci\xf3n",facebook:{seguidores:4471,videos:9,visitas:2173,visitasPorVideo:241},twitter:{seguidores:3314},instagram:{seguidores:2022,videos:0,visitas:0,visitasPorVideo:0},youtube:{seguidores:0,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}}},g={"Escuela de Salud Sur Colombiana":{institucion:"Escuela de Salud Sur Colombiana",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:5e3,videos:2,visitas:1e3,visitasPorVideo:500},twitter:{seguidores:100},instagram:{seguidores:600,videos:1,visitas:200,visitasPorVideo:200},youtube:{seguidores:50,videos:5,visitas:500,visitasPorVideo:100},tiktok:{seguidores:20}},"Asociaci\xf3n Colombiana de Facultades de Medicina (Ascofame)":{institucion:"Asociaci\xf3n Colombiana de Facultades de Medicina (Ascofame)",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:13e3,videos:2,visitas:2500,visitasPorVideo:1250},twitter:{seguidores:4500},instagram:{seguidores:150,videos:1,visitas:50,visitasPorVideo:50},youtube:{seguidores:3500,videos:6e4,visitas:500,visitasPorVideo:50},tiktok:{seguidores:10}},"Centros de Educaci\xf3n en Salud (Cedes)":{institucion:"Centros de Educaci\xf3n en Salud (Cedes)",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:3500,videos:2,visitas:200,visitasPorVideo:100},twitter:{seguidores:50},instagram:{seguidores:3500,videos:1,visitas:100,visitasPorVideo:100},youtube:{seguidores:100,videos:10,visitas:1e3,visitasPorVideo:100},tiktok:{seguidores:30}},"Consultor Salud":{institucion:"Consultor Salud",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:65e3,videos:25,visitas:3e4,visitasPorVideo:1200},twitter:{seguidores:7500},instagram:{seguidores:4500,videos:160,visitas:15e4,visitasPorVideo:937},youtube:{seguidores:1200,videos:10,visitas:1e3,visitasPorVideo:100},tiktok:{seguidores:50}},"Escuela Colombiana de Salud":{institucion:"Escuela Colombiana de Salud",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:2500,videos:1,visitas:100,visitasPorVideo:100},twitter:{seguidores:20},instagram:{seguidores:50,videos:2,visitas:300,visitasPorVideo:150},youtube:{seguidores:10,videos:2,visitas:200,visitasPorVideo:100},tiktok:{seguidores:5}},"Escuela de Salud del Cauca":{institucion:"Escuela de Salud del Cauca",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:9800,videos:2,visitas:200,visitasPorVideo:100},twitter:{seguidores:15},instagram:{seguidores:1700,videos:15,visitas:18e3,visitasPorVideo:1200},youtube:{seguidores:200,videos:10,visitas:1e3,visitasPorVideo:100},tiktok:{seguidores:30}},"Escuela de Salud San Pedro Claver":{institucion:"Escuela de Salud San Pedro Claver",ciudad:"Bogot\xe1",tipo:"Educaci\xf3n",facebook:{seguidores:2e3,videos:1,visitas:100,visitasPorVideo:100},twitter:{seguidores:30},instagram:{seguidores:500,videos:10,visitas:8e3,visitasPorVideo:800},youtube:{seguidores:60,videos:5,visitas:500,visitasPorVideo:100},tiktok:{seguidores:20}},"Escuela para auxiliares de enfermer\xeda San Rafael":{institucion:"Escuela para auxiliares de enfermer\xeda San Rafael",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:3500,videos:3,visitas:1e3,visitasPorVideo:333},twitter:{seguidores:5},instagram:{seguidores:100,videos:1,visitas:100,visitasPorVideo:100},youtube:{seguidores:30,videos:1,visitas:9e3,visitasPorVideo:9e3},tiktok:{seguidores:10}},"Fundaci\xf3n Universitaria de Ciencias de la salud (FUCS)":{institucion:"Fundaci\xf3n Universitaria de Ciencias de la salud (FUCS)",ciudad:"Bogot\xe1",tipo:"Educaci\xf3n",facebook:{seguidores:6e4,videos:55,visitas:7e4,visitasPorVideo:1273},twitter:{seguidores:4600},instagram:{seguidores:13e3,videos:530,visitas:275e3,visitasPorVideo:519},youtube:{seguidores:75e4,videos:5,visitas:1e3,visitasPorVideo:200},tiktok:{seguidores:60}},"Uniandes - Facultad de medicina":{institucion:"Uniandes - Facultad de medicina",ciudad:"Bogot\xe1",tipo:"Educaci\xf3n",facebook:{seguidores:4600,videos:10,visitas:2300,visitasPorVideo:230},twitter:{seguidores:3500},instagram:{seguidores:2200,videos:1,visitas:100,visitasPorVideo:100},youtube:{seguidores:50,videos:1,visitas:100,visitasPorVideo:100},tiktok:{seguidores:15}}},b={"Escuela de Salud Sur Colombiana":{institucion:"Escuela de Salud Sur Colombiana",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:4200,videos:3,visitas:950,visitasPorVideo:316},twitter:{seguidores:50},instagram:{seguidores:600,videos:1,visitas:150,visitasPorVideo:150},youtube:{seguidores:40,videos:6,visitas:600,visitasPorVideo:100},tiktok:{seguidores:25}},"Asociaci\xf3n Colombiana de Facultades de Medicina (Ascofame)":{institucion:"Asociaci\xf3n Colombiana de Facultades de Medicina (Ascofame)",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:14e3,videos:3,visitas:2700,visitasPorVideo:900},twitter:{seguidores:4600},instagram:{seguidores:160,videos:2,visitas:60,visitasPorVideo:30},youtube:{seguidores:3600,videos:58e3,visitas:800,visitasPorVideo:100},tiktok:{seguidores:15}},"Centros de Educaci\xf3n en Salud (Cedes)":{institucion:"Centros de Educaci\xf3n en Salud (Cedes)",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:3300,videos:2,visitas:250,visitasPorVideo:125},twitter:{seguidores:80},instagram:{seguidores:3100,videos:2,visitas:150,visitasPorVideo:75},youtube:{seguidores:150,videos:12,visitas:1200,visitasPorVideo:100},tiktok:{seguidores:40}},"Consultor Salud":{institucion:"Consultor Salud",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:64416,videos:22,visitas:25285,visitasPorVideo:1149},twitter:{seguidores:7305},instagram:{seguidores:4314,videos:148,visitas:147774,visitasPorVideo:998},youtube:{seguidores:999,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Escuela Colombiana de Salud":{institucion:"Escuela Colombiana de Salud",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:2395,videos:0,visitas:0,visitasPorVideo:0},twitter:{seguidores:0},instagram:{seguidores:28,videos:1,visitas:211,visitasPorVideo:211},youtube:{seguidores:3,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Escuela de Salud del Cauca":{institucion:"Escuela de Salud del Cauca",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:9612,videos:0,visitas:0,visitasPorVideo:0},twitter:{seguidores:0},instagram:{seguidores:1566,videos:14,visitas:16746,visitasPorVideo:1196},youtube:{seguidores:139,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Escuela de Salud San Pedro Claver":{institucion:"Escuela de Salud San Pedro Claver",ciudad:"Bogot\xe1",tipo:"Educaci\xf3n",facebook:{seguidores:1675,videos:0,visitas:0,visitasPorVideo:0},twitter:{seguidores:12},instagram:{seguidores:471,videos:9,visitas:7553,visitasPorVideo:839},youtube:{seguidores:52,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Escuela para auxiliares de enfermer\xeda San Rafael":{institucion:"Escuela para auxiliares de enfermer\xeda San Rafael",ciudad:"",tipo:"Educaci\xf3n",facebook:{seguidores:3395,videos:2,visitas:883,visitasPorVideo:442},twitter:{seguidores:1},instagram:{seguidores:0,videos:0,visitas:0,visitasPorVideo:0},youtube:{seguidores:21,videos:0,visitas:8677,visitasPorVideo:0},tiktok:{seguidores:0}},"Fundaci\xf3n Universitaria de Ciencias de la salud (FUCS)":{institucion:"Fundaci\xf3n Universitaria de Ciencias de la salud (FUCS)",ciudad:"Bogot\xe1",tipo:"Educaci\xf3n",facebook:{seguidores:59004,videos:51,visitas:65973,visitasPorVideo:1294},twitter:{seguidores:4529},instagram:{seguidores:12468,videos:513,visitas:268962,visitasPorVideo:524},youtube:{seguidores:743993,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}},"Uniandes - Facultad de medicina":{institucion:"Uniandes - Facultad de medicina",ciudad:"Bogot\xe1",tipo:"Educaci\xf3n",facebook:{seguidores:4471,videos:9,visitas:2173,visitasPorVideo:241},twitter:{seguidores:3314},instagram:{seguidores:2022,videos:0,visitas:0,visitasPorVideo:0},youtube:{seguidores:0,videos:0,visitas:0,visitasPorVideo:0},tiktok:{seguidores:0}}};var m=()=>{let[i,s]=(0,o.useState)(""),[e,d]=(0,o.useState)(""),[r,u]=(0,o.useState)("2024"),c=(i=>{switch(i){case"2024":default:return v;case"2023":return g;case"2022":return b}})(r);return(0,a.jsx)("div",{className:"dashboard p-6 bg-[#f6f3fa] min-h-screen",children:(0,a.jsxs)("div",{className:"max-w-7xl mx-auto",children:[(0,a.jsx)("div",{className:"mb-6 flex justify-between items-center",children:(0,a.jsx)("input",{type:"text",value:i,onChange:i=>s(i.target.value),placeholder:"Busca un hospital...",className:"w-full p-3 border border-gray-300 rounded-md"})}),(0,a.jsx)(t,{searchTerm:i,setSelectedEntity:i=>{d(i),console.log("Entidad seleccionada:",i)}}),e&&(0,a.jsxs)("div",{className:"flex flex-col",children:[(0,a.jsx)("div",{className:"flex justify-end mb-2",children:(0,a.jsxs)("select",{value:r,onChange:i=>u(i.target.value),className:"border border-gray-300 rounded-md mt-6",children:[(0,a.jsx)("option",{value:"2024",children:"2024"}),(0,a.jsx)("option",{value:"2023",children:"2023"}),(0,a.jsx)("option",{value:"2022",children:"2022"})]})}),(0,a.jsxs)("div",{className:"mt-2",children:[(0,a.jsx)(l,{entityData:c[e]}),(0,a.jsx)(n,{selectedEntity:e,entityData:c})]})]})]})})}}},function(i){i.O(0,[51,240,699,422,988,301,506,388,971,23,744],function(){return i(i.s=38923)}),_N_E=i.O()}]);