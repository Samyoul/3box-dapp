import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getProfile,
  checkNetwork,
  getActivity,
  accountsPromise,
  getCollectibles,
} from '../../state/actions';
import {
  PublicProfileLoading,
  SignInThroughPublicProfileBanner,
} from '../../components/Modals.jsx';
import {
  handleSignInBanner,
} from '../../state/actions-modals';
import { store } from '../../state/store';
import PubContent from '../../components/Profile/PublicProfile/PubContent';
import SideBar from '../../components/Profile/SideBar';
import Nav from '../../components/Nav';
import '../styles/Profile.css';

class ProfilePublic extends Component {
  async componentDidMount() {
    window.scrollTo(0, 0);
    const { location: { pathname }, currentAddress } = this.props;
    const publicProfileAddress = pathname.split('/')[1];
    let activeAddress;

    store.dispatch({
      type: 'UPDATE_PUBLIC_PROFILE',
      onPublicProfilePage: true,
      publicProfileAddress,
    });

    if (typeof window.web3 !== 'undefined') {
      if (!currentAddress) {
        const returnedAddress = await accountsPromise;
        [activeAddress] = returnedAddress;
      } else {
        activeAddress = currentAddress;
      }
      if (publicProfileAddress === activeAddress) this.props.handleSignInBanner();
      await this.props.checkNetwork();
    }

    await this.props.getProfile(publicProfileAddress);
    this.props.getCollectibles(publicProfileAddress, true);
    this.props.getActivity(publicProfileAddress);
  }

  componentWillUnmount() {
    store.dispatch({
      type: 'UPDATE_PUBLIC_PROFILE',
      onPublicProfilePage: false,
      publicProfileAddress: '',
    });
  }

  render() {
    const { isLoadingPublicProfile, showSignInBanner } = this.props;
    return (
      <div>
        <SignInThroughPublicProfileBanner show={showSignInBanner} handleSignInBanner={this.props.handleSignInBanner} />
        <div
          id="profile__page"
        >
          <div id="profile__contents">
            <SideBar isPublicProfilePage />
            <PubContent />
          </div>
          <PublicProfileLoading show={isLoadingPublicProfile} />
        </div>
      </div>
    );
  }
}

ProfilePublic.propTypes = {
  getProfile: PropTypes.func.isRequired,
  checkNetwork: PropTypes.func.isRequired,
  getActivity: PropTypes.func.isRequired,
  handleSignInBanner: PropTypes.func.isRequired,
  getCollectibles: PropTypes.func.isRequired,
  pathname: PropTypes.object,
  location: PropTypes.object,
  isLoadingPublicProfile: PropTypes.bool,
  showSignInBanner: PropTypes.bool,
  currentAddress: PropTypes.string,
};

ProfilePublic.defaultProps = {
  pathname: {},
  location: {},
  isLoadingPublicProfile: true,
  showSignInBanner: false,
  currentAddress: '',
};

const mapState = state => ({
  isLoadingPublicProfile: state.threeBox.isLoadingPublicProfile,
  showSignInBanner: state.threeBox.showSignInBanner,
  currentAddress: state.threeBox.currentAddress,
});

export default withRouter(connect(mapState,
  {
    getProfile,
    checkNetwork,
    getActivity,
    handleSignInBanner,
    getCollectibles,
  })(ProfilePublic));