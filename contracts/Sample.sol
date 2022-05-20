// SPDX-License-Identifier: MIT

// IMPORTANT: this smart contract is in a conceptual phase and is not yet finalized

pragma solidity ^0.8.5;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SampleContract is Ownable {
    using ECDSA for bytes32;

    event SampleEvent(Sample);
    event AnalysisEvent(Analysis);
    event InterpretationEvent(Interpretation);
    event LandNftEvent(bytes32, LandNft);

    struct Sample {
        uint256 timeStamp;
        string geoTag;
        address sampleTaker;
    }

    struct Analysis {
        address analyst;
        string measuredElementName;
        uint256 measuredElementAmount;
    }

    struct Interpretation {
        string[] measuredElementName;
        uint256[] measuredElementAmountMin;
        uint256[] measuredElementAmountMax;
        string[] measuredElementLabel;
    }

    struct LandNft {
        address landNftAddress;
        uint256 landNftId;
    }

    // token address not used, intended to reward people taking and analyzing nature samples
    address public immutable tokenAddress;
    uint256 public immutable sampleDecimals;

    // Map a GeoTag to a Land NFT
    mapping(string => LandNft) public geoTagLandNFT;

    // map a Land NFT to a set of GeoTags
    mapping(bytes32 => string[]) public nftGeoTags; // bytes32 is keccak256(abi.encodePacked(landNftAddress, landNftId))

    // Map a GeoTag to an array Samples (taken over time)
    mapping(string => Sample[]) public geoTagSamples;

    // map unique sample id to sample
    mapping(bytes32 => Sample) public samples; // bytes32 is keccak256(abi.encodePacked(geoTag, timeStamp))

    // map unique sample id to array of analysis
    mapping(bytes32 => Analysis[]) public analysis; // bytes32 is keccak256(abi.encodePacked(geoTag, timeStamp))

    constructor(
        address _tokenAddress,
        uint256 _sampleDecimals
    ) {
        tokenAddress = _tokenAddress;
        sampleDecimals = _sampleDecimals;
    }

    function getSamplesAtGeotag(string calldata _geoTag) public view returns (Sample[] memory) {
        Sample[] memory samplesRet = new Sample[](geoTagSamples[_geoTag].length);
        for (uint i = 0; i < geoTagSamples[_geoTag].length; i++) {
            samplesRet[i] = geoTagSamples[_geoTag][i];
        }
        return samplesRet;
    }

    function getAnalisysOfSample(bytes32 _sampleId) public view returns (Analysis[] memory) {
        Analysis[] memory analysisRet = new Analysis[](analysis[_sampleId].length);
        for (uint i = 0; i < analysis[_sampleId].length; i++) {
            analysisRet[i] = analysis[_sampleId][i];
        }
        return analysisRet;
    }

    // link a geotag to a land nft
    function addGeoTagToLandNft(string calldata _geoTag, address _landNftAddress, uint256 _landNftId) public {
        bytes32 landNftKey = keccak256(abi.encodePacked(_landNftAddress, _landNftId));
        geoTagLandNFT[_geoTag] = LandNft(_landNftAddress, _landNftId);
        nftGeoTags[landNftKey].push(_geoTag);

        emit LandNftEvent(landNftKey, geoTagLandNFT[_geoTag]);
    }

    // create a new sample
    function addSample(
        string calldata _geoTag, 
        uint256 _timeStamp, 
        address _sampleTaker, 
        bytes calldata _sampleTakerSignature
    ) public {
        require (_verifySignature(_timeStamp, _sampleTakerSignature, _sampleTaker), 
                    "Invalid signature from sample taker");
        bytes32 _id = keccak256(abi.encodePacked(_timeStamp, _geoTag));

        _createSample(_id, _geoTag, _timeStamp, _sampleTaker);
    }

    // add an analysis to an existing sample
    function addAnalysisToSample(
        uint256 _timeStamp, 
        string calldata _geoTag, 
        address _sampleAnalyst,
        bytes calldata _sampleAnalystSignature,
        string[] calldata _measuredElementName,
        uint256[] calldata _measuredElementAmount
    ) public {
        bytes32 _id = keccak256(abi.encodePacked(_timeStamp, _geoTag));
        require (_verifySignature(samples[_id].timeStamp, _sampleAnalystSignature, _sampleAnalyst), 
                    "Invalid signature from sample analyst");

        _createAnalysis(_id, _sampleAnalyst, _measuredElementName, _measuredElementAmount);
    }

    // create a new sample and add a set of analysis to it
    function addSampleWithAnalysis(
        string calldata _geoTag, 
        uint256 _timeStamp, 
        address _sampleTaker, 
        bytes memory _sampleTakerSignature,
        address _sampleAnalyst, 
        bytes memory _sampleAnalystSignature,        
        string[] calldata _measuredElementName,
        uint256[] calldata _measuredElementAmount
    ) public {
        bytes32 _id = keccak256(abi.encodePacked(_timeStamp, _geoTag));
        require (_verifySignature(_timeStamp, _sampleTakerSignature, _sampleTaker), 
                    "Invalid signature from sample taker");    
        require (_verifySignature(_timeStamp, _sampleAnalystSignature, _sampleAnalyst), 
                    "Invalid signature from sample analyst");

        _createSample(_id, _geoTag, _timeStamp, _sampleTaker);

        _createAnalysis(_id, _sampleAnalyst, _measuredElementName, _measuredElementAmount);
    }

    function _createSample(
        bytes32 _id,
        string calldata _geoTag, 
        uint256 _timeStamp, 
        address _sampleTaker) private {
        // add sample to map
        samples[_id] = Sample(_timeStamp, _geoTag, _sampleTaker);

        // add sample to geoTag so it can be retrieved by geoTag
        geoTagSamples[_geoTag].push(samples[_id]);
        
        emit SampleEvent(samples[_id]);
    }

    // create a set of analysis for a sample
    function _createAnalysis(      
        bytes32 _id, 
        address _sampleAnalyst,    
        string[] calldata _measuredElementName,
        uint256[] calldata _measuredElementAmount) private {
        uint len = _measuredElementName.length;
        for (uint i = 0; i < len; i++) {
            Analysis memory a = Analysis(
                _sampleAnalyst, 
                _measuredElementName[i], 
                _measuredElementAmount[i]);
            analysis[_id].push(a);
            emit AnalysisEvent(a);
        }
    }

    // allows for a delegated approach where the sample taker or analyst does not have to be the same 
    // as the entity that does the blockchain transaction
    function _verifySignature(uint256 timestamp, bytes memory signature, address signer) private pure returns (bool) {
        return bytes32(timestamp).toEthSignedMessageHash().recover(signature) == signer;
    }
}
