'use client';

import { useEffect } from 'react';

const BootstrapClient: React.FC = () => {
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js' as never);
    }, []);

    return null;
};

export default BootstrapClient;