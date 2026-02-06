import RequireRoleSession from "./RequireRoleSession";

const RequireAdmin = ({ children }) => (
  <RequireRoleSession roles={["ADMIN"]} redirectTo="/admin/login">
    {children}
  </RequireRoleSession>
);

export default RequireAdmin;
