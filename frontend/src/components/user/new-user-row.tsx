// "use client"

// import type React from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { TableCell, TableRow } from "@/components/ui/table"
// import { Plus } from "lucide-react"

// interface NewUserRowProps {
//   newUser: {
//     username: string
//     email: string
//     roles: string[]
//   }
//   setNewUser: React.Dispatch<
//     React.SetStateAction<{
//       username: string
//       email: string
//       roles: string[]
//     }>
//   >
//   onCreate: () => void
// }

// export function NewUserRow({ newUser, setNewUser, onCreate }: NewUserRowProps) {
//   const handleChange = (field: string, value: any) => {
//     setNewUser((prev) => ({ ...prev, [field]: value }))
//   }

//   return (
//     <TableRow className="bg-muted/50">
//       <TableCell>
//         <div className="text-muted-foreground italic">ID tự động</div>
//       </TableCell>
//       <TableCell>
//         <Input
//           placeholder="Tên người dùng"
//           value={newUser.username}
//           onChange={(e) => handleChange("username", e.target.value)}
//           className="w-full"
//         />
//       </TableCell>
//       <TableCell>
//         <Input
//           placeholder="Email"
//           type="email"
//           value={newUser.email}
//           onChange={(e) => handleChange("email", e.target.value)}
//           className="w-full"
//         />
//       </TableCell>
//       <TableCell>
//         <Select value={newUser.roles[0]} onValueChange={(value) => handleChange("roles", [value])}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Chọn vai trò" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="user">Người dùng</SelectItem>
//             <SelectItem value="admin">Quản trị viên</SelectItem>
//             <SelectItem value="moderator">Điều hành viên</SelectItem>
//           </SelectContent>
//         </Select>
//       </TableCell>
//       <TableCell>
//         <div className="text-muted-foreground italic">Tự động</div>
//       </TableCell>
//       <TableCell className="text-right">
//         <Button onClick={onCreate} className="gap-1">
//           <Plus className="h-4 w-4" />
//           Thêm
//         </Button>
//       </TableCell>
//     </TableRow>
//   )
// }
