import { Admin, type BkndAdminProps } from "bknd/ui";
import "bknd/dist/styles.css";

export default function AdminClient(props: BkndAdminProps = {}) {
   return <Admin {...props} />;
}
