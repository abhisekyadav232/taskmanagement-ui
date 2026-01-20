// export function getUserFromToken() {
//   const token = localStorage.getItem("token")
//   if (!token) return null

//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]))

//     return {
//       name: payload.fullName,
//       email: payload.unique_name,
//       role: payload.role
//     }
//   } catch {
//     return null
//   }
// }
