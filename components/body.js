import Head from 'next/head'
export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <style jsx global>{`
      body { 
        font: 'sans-serif';
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0
      }
    `}</style>
  </div>
)