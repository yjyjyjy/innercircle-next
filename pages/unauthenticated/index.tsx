import UnauthenticatedUser from '../../components/UnauthenticatedUser'

export async function getStaticProps() {
   return {
      props: {}, // will be passed to the page component as props
   }
}

const Unauthenticated = () => {
   return <UnauthenticatedUser />
}

export default Unauthenticated
