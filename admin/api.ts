import {api} from "../src/apps/cloud/api";
export {api};
export function write<T>(path:string,csrfToken:string,body:unknown,method="POST") {
  return api<T>(path,{method,headers:{"Content-Type":"application/json","X-CSRF-Token":csrfToken},body:JSON.stringify(body)});
}
export function message(error:unknown) {
  const code=error instanceof Error?error.message:"";
  if(code==="unknown_media")return "Такого изображения нет в проверенной медиатеке. Используйте существующий адрес /media/. Загрузка новых файлов пока не подключена.";
  return ({revision_conflict:"Материал изменён в другом окне. Ваш текст сохранён здесь; скачайте копию и загрузите актуальную редакцию.",invalid_credentials:"Не удалось войти. Проверьте логин, пароль и код из приложения.",login_rate_limited:"Слишком много попыток. Повторите вход через 15 минут.",authentication_required:"Сессия завершилась. Скачайте копию правок и войдите снова.",scheduled_maintenance:"Начались технические работы. Правки пока остаются только в этом окне.",invalid_input:"Проверьте заполнение всех полей и структуру материала."} as Record<string,string>)[code]??"Операция не выполнена. Проверьте соединение и повторите попытку; ваши правки остаются в этом окне.";
}
