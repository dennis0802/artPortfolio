import { Component } from 'react';
import { withRouter } from '../common/with-router';
import { Spinner } from 'react-bootstrap';


class Loading extends Component{

    render(){
        return(
            <>
              <Spinner animation="border" variant="info" className="mt-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </>
        )
    }
}

export default withRouter(Loading)