import Router from 'koa-router';
import axios from './utils/axios';

let router = new Router({
	prefix: '/geo'
});

const sign = 'f248cf6789e82fb1c23333168df703f0'

router.get('/getPosition',async (ctx) => {
  let { status, data: {province, city}} = await axios.get(`http://cp-tools.cn/geo/getPosition`); 

  if(status === 200){
    ctx.body = {
      province,
      city
    }
  }else{
    ctx.body = {
      province : '',
      city: ""
    }
  }
})

router.get('/menu',async (ctx) => {
  let {status,data: {menu}} = await axios.get('`http://cp-tools.cn/geo/menu?sign=${sign}`')
  if(status === 200){
    ctx.body = {
      menu
    }
  }else{
    ctx.body = {
      menu : []
    }
  }
})



export default router