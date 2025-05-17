import { stylesItemsGrid } from './AdminPage.styles';
import { useParams, useSearchParams } from 'react-router-dom';
// import { DrizzleAdmin } from 'drizzle-admin/components';
// import { config } from './drizzle-admin.config';

export const AdminPage = () => {
  // const params = useParams() as unknown as Promise<{ [key: string]: string }>;
  // const [searchParams] = useSearchParams() as unknown as [Promise<{ [key: string]: string }>];

  return (
    <section css={stylesItemsGrid}>
      {/* <DrizzleAdmin params={params} searchParams={searchParams} config={config} /> */}
      <h1>Admin Page</h1>
    </section>
  );
};
