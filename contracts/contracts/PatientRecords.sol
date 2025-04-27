// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {
    struct Record {
        string pointer;      // your off-chain record ID (MongoDB _id)
        uint256 timestamp;   // when it was stored
    }

    // patient UUID → array of on-chain pointers
    mapping(string => Record[]) private records;

    // emit this on each store for easy off-chain indexing
    event RecordStored(
        string indexed patientId,
        string pointer,
        uint256 timestamp
    );

    /// @notice Store a new record pointer for a given patient
    /// @param patientId the UUID you generated in MongoDB
    /// @param pointer    the recordId returned by your API
    function storeRecord(
        string calldata patientId,
        string calldata pointer
    ) external {
        records[patientId].push(Record(pointer, block.timestamp));
        emit RecordStored(patientId, pointer, block.timestamp);
    }

    /// @notice How many records this patient has
    /// @param patientId the UUID
    /// @return the count of records
    function getRecordCount(
        string calldata patientId
    ) external view returns (uint256) {
        return records[patientId].length;
    }

    /// @notice Fetch a specific pointer + timestamp by index
    /// @param patientId the UUID
    /// @param index     which record (0-based)
    /// @return pointer  the recordId
    /// @return ts       when it was stored
    function getRecord(
        string calldata patientId,
        uint256 index
    ) external view returns (string memory pointer, uint256 ts) {
        Record storage rec = records[patientId][index];
        return (rec.pointer, rec.timestamp);
    }
}
